// --- CONFIGURATION ---
const RENDER_URL = "https://botbay-python-services-latest.onrender.com";

import { supabase } from "./auth.js";

import { isUserSignedIn, getUserGroup } from "./auth.js";

/**
 * Helper function to handle the authenticated fetch to Flask
 */
async function flaskRequest(endpoint, method = "GET", body = null) {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
        console.error("User is not logged in");
        return { error: "No session found" };
    }

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    };

    if (method !== "GET" && body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${RENDER_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Request failed");
    return result;
}

/// ~~~ PARTS RELATED ~~~ ///

export async function overwritePart(part) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("update_full_part", {
            target_team_id: Number(teamId),
            target_part_id: Number(part.id),
            updated_part_data: part,
        });

        if (error) {
            console.error("Error overwriting part in cloud:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        console.error("System error in overwritePart:", err);
        return { success: false, error: err.message };
    }
}

export async function overwriteQuant(partId, quant, needed) {
    const { group: teamId } = await getUserGroup();
    try {
        console.log("Attempting to push new quants");
        // Explicitly cast to Numbers to match SQL int8/int4 types
        const { data, error } = await supabase.rpc("update_part_quantities", {
            target_team_id: Number(teamId),
            target_part_id: Number(partId),
            new_quant: Number(quant),
            new_needed: Number(needed),
        });

        if (error) {
            console.error("RPC Error:", error.message);
            return { success: false, error: error.message };
        }

        // Sync local storage so the Dashboard table updates immediately
        if (data) {
            localStorage.setItem("partData", JSON.stringify(data));
            window.dispatchEvent(new Event("storage"));
        }

        return { success: true, data };
    } catch (err) {
        console.error("System Error in overwriteQuant:", err);
        return { success: false, error: err.message };
    }
}

export const cloudCreatePart = async (itemData, teamId) => {
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { data, error } = await supabase.rpc("create_new_part_cloud", {
            item_data: itemData,
            target_team_id: teamId,
            requestor_id: user.id,
        });

        if (error) throw error;
        return { success: true, item: data };
    } catch (error) {
        console.error("Cloud append failed:", error.message);
        return { success: false, error: error.message };
    }
};

export async function cloudDeletePart(id) {
    const signedIn = await isUserSignedIn();
    let success = false;

    if (signedIn) {
        const { group: teamId } = await getUserGroup();
        if (teamId) {
            const { data, error } = await supabase.rpc("delete_part_secure", {
                target_part_id: id,
                target_team_id: teamId,
            });

            if (!error) {
                success = true;
            } else {
                console.error("Cloud delete failed:", error);
            }
        }
    }

    const rawData = localStorage.getItem("partData") || "[]";
    const data = JSON.parse(rawData);
    const updated = data.filter((p) => String(p.id) !== String(id));

    localStorage.setItem("partData", JSON.stringify(updated));

    // Notify the Dashboard (the "poke" we set up earlier)
    window.dispatchEvent(new Event("storage"));

    return success || !signedIn;
}

export async function readPart(partId) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("get_single_part", {
            target_team_id: Number(teamId),
            target_part_id: Number(partId),
        });

        if (error) {
            console.error("Error reading part from cloud:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("System error in readPart:", err);
        return null;
    }
}

/// ~~~ BATTERY RELATED ~~~ ///

export async function deleteBattery(nameToDelete) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("delete_battery_by_name", {
            target_team_id: Number(teamId),
            battery_name: nameToDelete,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("Database error deleting battery:", err.message);
        return { success: false, error: err.message };
    }
}

export async function createBattery(battery) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("add_new_battery", {
            target_team_id: Number(teamId),
            new_battery_object: battery,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("Database error adding battery:", err.message);
        return { success: false, error: err.message };
    }
}

export async function updateBatteryStatusCloud(updatedBattery) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("update_battery_by_name", {
            target_team_id: Number(teamId),
            target_name: updatedBattery.name,
            new_battery_data: updatedBattery,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("Database error updating battery:", err.message);
        return { success: false, error: err.message };
    }
}

/// ~~~ TAGS RELATED ~~~ ///

export async function deleteTagCloud(tagName) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("delete_tag_globally", {
            target_team_id: Number(teamId),
            tag_name_to_delete: tagName,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("Database error:", err.message);
        return { success: false, error: err.message };
    }
}

export async function createTag(tag) {
    const { group: teamId } = await getUserGroup();

    try {
        const { data, error } = await supabase.rpc("add_new_tag", {
            target_team_id: Number(teamId),
            new_tag_object: tag,
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("Database error adding tag:", err.message);
        return { success: false, error: err.message };
    }
}

/// ~~~ SYNC RELATED ~~~ ///

/**
 * Syncs all local storage data (Parts, Tags, Batteries) to the cloud group
 * in a single request to the Python backend.
 */
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
