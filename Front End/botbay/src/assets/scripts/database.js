// --- CONFIGURATION ---
const RENDER_URL = "https://botbay-python-services-latest.onrender.com";

import { supabase } from "./auth.js";
import { isUserSignedIn, getUserGroup } from "./auth.js";

/**
 * INTERNAL STATE: Store the Socket ID globally within this module.
 * Set this once upon socket connection in your socket initialization file.
 */
let currentSocketId = null;

export const setSocketId = (sid) => {
    console.log(`[database.js] Socket ID synchronized: ${sid}`);
    currentSocketId = sid;
};

/**
 * Helper function to handle the authenticated fetch to Flask.
 * Automatically injects the 'sid' into the request body for POST/PUT.
 */
async function flaskRequest(endpoint, method = "GET", body = null) {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
        console.error(
            "[flaskRequest] No token found. User likely not logged in.",
        );
        return { error: "No session found" };
    }

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    };

    // Automatically inject sid if it exists and method is not GET
    if (method !== "GET") {
        const payload = body || {};
        options.body = JSON.stringify({
            ...payload,
            sid: currentSocketId,
        });
    }

    console.log(`[flaskRequest] Sending ${method} to ${endpoint}`);
    const response = await fetch(`${RENDER_URL}${endpoint}`, options);

    // Handle empty successful responses
    if (response.status === 204) return { success: true };

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed");
    return result;
}

/// ~~~ PARTS RELATED ~~~ ///

export async function overwritePart(part) {
    const { group: teamId } = await getUserGroup();
    try {
        const result = await flaskRequest(
            `/database/${teamId}/parts/overwrite-logic/${part.id}`,
            "POST",
            { updated_part_data: part },
        );
        return { success: true, data: result };
    } catch (err) {
        console.error("[Trace] overwritePart failed:", err);
        return { success: false, error: err.message };
    }
}

export async function overwriteQuant(partId, quant, needed) {
    const { group: teamId } = await getUserGroup();
    try {
        const result = await flaskRequest(
            `/database/${teamId}/parts/update-quantities/${partId}`,
            "POST",
            {
                new_quant: Number(quant),
                new_needed: Number(needed),
            },
        );

        if (result.success && result.data) {
            localStorage.setItem("partData", JSON.stringify(result.data));
            window.dispatchEvent(new Event("storage"));
        }
        return result;
    } catch (err) {
        console.error("[Trace] overwriteQuant failed:", err);
        return { success: false, error: err.message };
    }
}

export const cloudCreatePart = async (itemData, teamId) => {
    try {
        return await flaskRequest(`/database/${teamId}/parts/add`, "POST", {
            item_data: itemData,
        });
    } catch (err) {
        console.error("[Trace] cloudCreatePart failed:", err);
        return { success: false, error: err.message };
    }
};

export async function cloudDeletePart(id) {
    const signedIn = await isUserSignedIn();
    let success = false;

    if (signedIn) {
        const { group: teamId } = await getUserGroup();
        if (teamId) {
            try {
                // Use POST so we can send the SID body to the server
                const result = await flaskRequest(
                    `/database/${teamId}/parts/delete/${id}`,
                    "POST",
                    {},
                );
                success = result.success;
            } catch (err) {
                console.error("[Delete Trace] Cloud delete error:", err);
            }
        }
    }

    // Local Storage Cleanup (Optimistic Update)
    const rawData = localStorage.getItem("partData") || "[]";
    const data = JSON.parse(rawData);
    const updated = data.filter((p) => String(p.id) !== String(id));
    localStorage.setItem("partData", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));

    return success || !signedIn;
}

export async function readPart(partId) {
    const { group: teamId } = await getUserGroup();
    try {
        const result = await flaskRequest(
            `/database/${teamId}/parts/get/${partId}`,
            "GET",
        );
        return result.data;
    } catch (err) {
        console.error("[Trace] readPart failed:", err);
        return null;
    }
}

/// ~~~ BATTERY RELATED ~~~ ///

export async function deleteBattery(nameToDelete) {
    const { group: teamId } = await getUserGroup();
    try {
        // Use POST for SID support
        return await flaskRequest(
            `/database/${teamId}/batteries/delete/${nameToDelete}`,
            "POST",
            {},
        );
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function createBattery(battery) {
    const { group: teamId } = await getUserGroup();
    try {
        return await flaskRequest(`/database/${teamId}/batteries/add`, "POST", {
            battery,
        });
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function updateBatteryStatusCloud(updatedBattery) {
    const { group: teamId } = await getUserGroup();
    try {
        return await flaskRequest(
            `/database/${teamId}/batteries/update`,
            "POST",
            { updatedBattery },
        );
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/// ~~~ TAGS RELATED ~~~ ///

export async function deleteTagCloud(tagName) {
    const { group: teamId } = await getUserGroup();
    try {
        // Use POST for SID support
        return await flaskRequest(
            `/database/${teamId}/tags/delete/${tagName}`,
            "POST",
            {},
        );
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function createTag(tag) {
    const { group: teamId } = await getUserGroup();
    try {
        return await flaskRequest(`/database/${teamId}/tags/add`, "POST", {
            tag,
        });
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/// ~~~ SYNC RELATED ~~~ ///

export async function syncLocalData(groupId, parts, tags, batteries) {
    return await flaskRequest(`/database/${groupId}/sync`, "POST", {
        parts: parts || [],
        tags: tags || [],
        batteries: batteries || [],
    });
}

export async function getCloudData(groupId) {
    return await flaskRequest(`/database/${groupId}/all-data`, "GET");
}
