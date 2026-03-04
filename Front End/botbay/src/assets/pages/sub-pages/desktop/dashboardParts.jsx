import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { MdDownload, MdUpload } from "react-icons/md";
import {
    RiExpandUpDownFill,
    RiArrowDownSFill,
    RiArrowUpSFill,
} from "react-icons/ri";
import { FaTags } from "react-icons/fa";
import { IoTrashSharp } from "react-icons/io5";
import PartItem from "../../components/partItem";
import MotorList from "../../components/partStatComponents/Desktop/motor";
import ServoList from "../../components/partStatComponents/Desktop/servo";
import StructuralList from "../../components/partStatComponents/Desktop/structural";
import ElectricalList from "../../components/partStatComponents/Desktop/electrical";
import SensorList from "../../components/partStatComponents/Desktop/sensor";
import ThreeDPrintedList from "../../components/partStatComponents/Desktop/3dprint";
import MachinedList from "../../components/partStatComponents/Desktop/machined";
import OtherList from "../../components/partStatComponents/Desktop/other";
import Blocker from "../../components/blocker";
import Sketch from "@uiw/react-color-sketch";
import WarningPopup from "../../components/warningpopup";

import { MotorStatList } from "../editListUtils";
import { ServoStatList } from "../editListUtils";
import { StructuralStatList } from "../editListUtils";
import { ElectricalStatList } from "../editListUtils";
import { SensorStatList } from "../editListUtils";
import { ThreeDPrintedStatList } from "../editListUtils";
import { MachinedStatList } from "../editListUtils";
import { OtherStatList } from "../editListUtils";

import { megaSchema } from "../editListUtils";

import { AddItemMenuDesktop } from "../../components/addItem";
import { useMargin } from "recharts";

function PartsPageDesktop({ partToRun, usePartToRun, onReturn, onReset }) {
    const [isPhone, setIsPhone] = useState(window.innerWidth < 1200);

    useEffect(() => {
        const handleResize = () => {
            setIsPhone(window.innerWidth < 1200);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [usePartToRunLocal, setUsePartToRun] = useState(usePartToRun);

    const [isEditPartOpen, setIsEditPartOpen] = useState(false);

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("taglist") || "[]");
        setAvailableTags(stored);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const existingParts = JSON.parse(
            localStorage.getItem("partData") || "[]",
        );

        // 1. Initialize the base stats object with the type
        let statsObj = { type: formData.type };

        // 2. The Giant Switch Case to pack only relevant data
        switch (formData.type) {
            case "motor":
                statsObj = {
                    ...statsObj,
                    voltage: Number(formData.voltage) || null,
                    max_power: Number(formData.maxPower) || null,
                    stall_current: Number(formData.stallCurrent) || null,
                    stall_torque: Number(formData.stallTorque) || null,
                    no_load_speed: Number(formData.noLoadSpeed) || null,
                    output_shaft_length:
                        Number(formData.outputShaftLength) || null,
                    cpr: Number(formData.cpr) || null,
                    ppr: Number(formData.ppr) || null,
                    shaft_type: formData.shaftType || "",
                    connector_types: formatConnectors(formData.connectorTypes),
                };
                break;

            case "servo":
                statsObj = {
                    ...statsObj,
                    size: [
                        Number(formData.sizeL) || 0,
                        Number(formData.sizeW) || 0,
                        Number(formData.sizeH) || 0,
                    ],
                    weight: Number(formData.weight) || null,
                    speed: formData.speed || "",
                    angular_range: formData.angularRange || "",
                    gear_material: formData.gearMaterial || "",
                    spline_type: formData.splineType || "",
                    spline_thread_type: formData.splineThreadType || "",
                    spline_internal_depth: formData.splineInternalDepth || "",
                    stall_current: Number(formData.stallCurrent) || null,
                    stall_torque: Number(formData.stallTorque) || null,
                };
                break;

            case "electrical":
                statsObj = {
                    ...statsObj,
                    capacity: formData.capacity || "",
                    voltage: Number(formData.voltage) || null,
                    weight: Number(formData.weight) || null,
                    wire_gauge: formData.wireGauge || "",
                    size: [
                        Number(formData.sizeL) || 0,
                        Number(formData.sizeW) || 0,
                        Number(formData.sizeH) || 0,
                    ],
                    connector_types: formatConnectors(formData.connectorTypes),
                    replaceable_fuse: formData.replaceableFuse || "",
                    max_discharge: formData.maxDischarge || "",
                    wire_length: formData.wireLength || "",
                    charge_rates: formData.chargeRates || "",
                };
                break;

            case "sensor":
                statsObj = {
                    ...statsObj,
                    sensor_type: formData.sensorType || "",
                    max_voltage: Number(formData.maxVoltage) || null,
                    size: [
                        Number(formData.sizeL) || 0,
                        Number(formData.sizeW) || 0,
                        Number(formData.sizeH) || 0,
                    ],
                    prox_min: formData.proxMin || "",
                    prox_max: formData.proxMax || "",
                    dist_min: formData.distMin || "",
                    dist_max: formData.distMax || "",
                    fov: formData.fov || "",
                    imu: formData.imu || "",
                    cpr: Number(formData.cpr) || null,
                };
                break;

            case "3d-printed":
                statsObj = {
                    ...statsObj,
                    size: [
                        Number(formData.sizeL) || 0,
                        Number(formData.sizeW) || 0,
                        Number(formData.sizeH) || 0,
                    ],
                    infill: formData.infill || "",
                    filament: formData.filament || "",
                    wall_loops: formData.wallLoops || "",
                    infill_pattern: formData.infillPattern || "",
                    support: formData.support || "",
                    support_type: formData.supportType || "",
                    on_buildplate_only: formData.onBuildplateOnly || "",
                    remove_small_overhangs: formData.removeSmallOverhangs || "",
                    threshold_angle: formData.thresholdAngle || "",
                    brim_type: formData.brimType || "",
                    brim_width: formData.brimWidth || "",
                    brim_object_gap: formData.brimObjectGap || "",
                    filament_amount: formData.filamentAmount || "",
                    cost: formData.cost || "",
                    time_h: formData.timeH || "0",
                    time_m: formData.timeM || "",
                };
                break;

            case "other":
                statsObj = {
                    ...statsObj,
                    description: formData.description || "",
                };
                break;

            default:
                // Structural, Machined, etc.
                statsObj = {
                    ...statsObj,
                    size: [
                        Number(formData.sizeL) || 0,
                        Number(formData.sizeW) || 0,
                        Number(formData.sizeH) || 0,
                    ],
                };
        }

        // 3. Construct the Final Object
        const updatedPart = {
            id: formData.id,
            name: formData.name,
            manufacturer: formData.manufacturer,
            manufacturerId: formData.manufacturerId,
            type: formData.type,
            tags: formData.tags,
            icon: formData.iconLink,
            stats: statsObj,
            links: {
                CAD: formData.cadLink || "",
                Store: formData.storeLink || "",
            },

            quantity: currentItem.quantity ?? 0,
            needed: currentItem.needed ?? 0,
            editable: true,
        };

        // 4. Update and Save
        const updatedPartsList = existingParts.map((part) =>
            part.id === formData.id ? updatedPart : part,
        );

        localStorage.setItem("partData", JSON.stringify(updatedPartsList));
        handleEditClose();
    };

    // Helper to keep logic clean
    const formatConnectors = (data) => {
        return typeof data === "string"
            ? data
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s !== "")
            : data || [];
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleEditTag = (tagName) => {
        setFormData((prev) => {
            const currentTags = prev.tags ?? [];

            const isSelected = currentTags.includes(tagName);
            const newTags = isSelected
                ? currentTags.filter((t) => t !== tagName)
                : [...currentTags, tagName];

            return { ...prev, tags: newTags };
        });
    };

    const [formData, setFormData] = useState(megaSchema);

    function renderSpecificEditStatContent() {
        // motor: 0,
        // servo: 1,
        // structural: 2,
        // electrical: 3,
        // sensor: 4,
        // "3d-printed": 5,
        // machined: 6,
        // other: 7,
        // wheel: 8,

        switch (currentItem.stats.type) {
            case "motor":
                return (
                    <MotorStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "servo":
                return (
                    <ServoStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "structural":
                return (
                    <StructuralStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "electrical":
                return (
                    <ElectricalStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "sensor":
                return (
                    <SensorStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "3d-print":
                return (
                    <ThreeDPrintedStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "machined":
                return (
                    <MachinedStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );

            case "other":
                return (
                    <OtherStatList
                        handleChange={handleChange}
                        formData={formData}
                    />
                );
        }
    }

    function handleEditOpen(item) {
        setIsEditPartOpen(true);
        onExitClick();

        const partTypeMap = {
            motor: 0,
            servo: 1,
            structural: 2,
            electrical: 3,
            sensor: 4,
            "3d-printed": 5,
            machined: 6,
            other: 7,
            wheel: 8,
        };

        // 1. Set the index for your UI tabs/selection
        const type = item.type || item.stats?.type || "other";
        setPartType(partTypeMap[type]);

        // 2. Flatten the nested 'item' into the Mega Schema structure
        const flattenedData = {
            ...megaSchema, // Start with the empty template
            id: item.id,
            type: type,
            name: item.name || "",
            manufacturer: item.manufacturer || "",
            manufacturerId: item.manufacturerId || "",
            tags: item.tags || [],

            // Links & Icon
            iconLink: item.icon || "",
            cadLink: item.links?.CAD || "",
            storeLink: item.links?.Store || "",

            // Stats: Motor & Servo
            voltage: item.stats?.voltage ?? "",
            maxPower: item.stats?.max_power ?? "",
            stallCurrent: item.stats?.stall_current ?? "",
            stallTorque: item.stats?.stall_torque ?? "",
            noLoadSpeed: item.stats?.no_load_speed ?? "",
            outputShaftLength: item.stats?.output_shaft_length ?? "",
            cpr: item.stats?.cpr ?? "",
            ppr: item.stats?.ppr ?? "",
            shaftType: item.stats?.shaft_type ?? "",
            speed: item.stats?.speed ?? "",
            angularRange: item.stats?.angular_range ?? "",
            gearMaterial: item.stats?.gear_material ?? "",
            splineType: item.stats?.spline_type ?? "",
            splineThreadType: item.stats?.spline_thread_type ?? "",
            splineInternalDepth: item.stats?.spline_internal_depth ?? "",

            // Stats: Physical & Dimensions
            sizeL: item.stats?.size?.[0] ?? item.stats?.size_l ?? "",
            sizeW: item.stats?.size?.[1] ?? item.stats?.size_w ?? "",
            sizeH: item.stats?.size?.[2] ?? item.stats?.size_h ?? "",
            weight: item.stats?.weight ?? "",

            // Stats: Electrical
            capacity: item.stats?.capacity ?? "",
            wireGauge: item.stats?.wire_gauge ?? "",
            wireLength: item.stats?.wire_length ?? "",
            maxDischarge: item.stats?.max_discharge ?? "",
            chargeRates: item.stats?.charge_rates ?? "",
            replaceableFuse: item.stats?.replaceable_fuse ?? "",

            // Stats: Sensor
            sensorType: item.stats?.sensor_type ?? "",
            maxVoltage: item.stats?.max_voltage ?? "",
            proxMin: item.stats?.prox_min ?? "",
            proxMax: item.stats?.prox_max ?? "",
            distMin: item.stats?.dist_min ?? "",
            distMax: item.stats?.dist_max ?? "",
            fov: item.stats?.fov ?? "",
            imu: item.stats?.imu ?? "",

            // Stats: 3D Printed
            infill: item.stats?.infill ?? "",
            filament: item.stats?.filament ?? "",
            wallLoops: item.stats?.wall_loops ?? "",
            infillPattern: item.stats?.infill_pattern ?? "",
            support: item.stats?.support ?? "",
            supportType: item.stats?.support_type ?? "",
            onBuildplateOnly: item.stats?.on_buildplate_only ?? "",
            removeSmallOverhangs: item.stats?.remove_small_overhangs ?? "",
            thresholdAngle: item.stats?.threshold_angle ?? "",
            brimType: item.stats?.brim_type ?? "",
            brimWidth: item.stats?.brim_width ?? "",
            brimObjectGap: item.stats?.brim_object_gap ?? "",
            filamentAmount: item.stats?.filament_amount ?? "",
            cost: item.stats?.cost ?? "",
            timeH: item.stats?.time_h ?? "0",
            timeM: item.stats?.time_m ?? "",

            // Stats: Other
            description: item.stats?.description || "",

            // Special Case: Convert Array to Comma String for input
            connectorTypes: Array.isArray(item.stats?.connector_types)
                ? item.stats.connector_types.join(", ")
                : (item.stats?.connector_types ?? ""),
        };

        // 3. Set the WORKING state (the one the inputs use)
        setFormData(flattenedData);

        // 4. Set the REFERENCE state (if you still need it for comparison)
        setCurrentItem(item);
    }

    function handleEditClose() {
        setFormData(megaSchema);
        setIsEditPartOpen(false);
        onExitClick();
    }

    const [isManageTagPopupOpen, setIsManageTagPopupOpen] = useState(false);
    const [deletingTagName, setDeletingTagName] = useState(null);

    const [newTagName, setNewTagName] = useState("");
    const [tagError, setTagError] = useState("");

    const [currentItem, setCurrentItem] = useState(null);
    const [currentQuant, setCurrentQuant] = useState(0);
    const [currentNeeded, setCurrentNeeded] = useState(0);

    const [isAddItemOpen, setIsAddItemOpen] = useState(false);

    const [query, setQuery] = useState("");
    const [listResults, setListResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isPartOverlayOpen, setIsPartOverlayOpen] = useState(false);

    const [isBlockerOpen, setIsBlockerOpen] = useState(false);
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

    // Load parts from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("partData");
        if (savedData) {
            setListResults(JSON.parse(savedData));
        } else {
            setListResults([]);
        }
    }, []);

    // Load tags from localStorage
    useEffect(() => {
        const savedTags = localStorage.getItem("taglist");
        if (savedTags) {
            setTags(JSON.parse(savedTags));
        } else {
            setTags([]); // fallback to empty array
            localStorage.setItem("taglist", JSON.stringify([])); // initialize localStorage
        }
    }, []);

    // Add new tag
    const addTag = (tagName, color) => {
        const newTag = { name: tagName, color, deletable: true };
        setTags((prevTags) => {
            const updatedTags = [...prevTags, newTag];
            localStorage.setItem("taglist", JSON.stringify(updatedTags));
            return updatedTags;
        });
        onTagExitClick();
    };

    const deleteTag = (tagName) => {
        // 1. Get the freshest data directly from Storage to avoid state-sync issues
        const rawParts = JSON.parse(localStorage.getItem("partData") || "[]");
        const rawTags = JSON.parse(localStorage.getItem("taglist") || "[]");

        // 2. Filter out the tag from the Master Tag List
        const updatedTagList = rawTags.filter((tag) => tag.name !== tagName);

        // 3. Scrub the tag from every single part's tag array
        const updatedParts = rawParts.map((part) => {
            if (part.tags && Array.isArray(part.tags)) {
                return {
                    ...part,
                    tags: part.tags.filter((t) => t !== tagName),
                };
            }
            return part;
        });

        // 4. Update LocalStorage (The Source of Truth)
        localStorage.setItem("taglist", JSON.stringify(updatedTagList));
        localStorage.setItem("partData", JSON.stringify(updatedParts));

        // 5. Update React State (The UI)
        setTags(updatedTagList);
        setListResults(updatedParts);

        // 6. Remove from active filters if it was selected
        setSelectedTags((prev) => prev.filter((t) => t !== tagName));

        // 7. UI Cleanup
        setDeletingTagName(null);
    };

    const [hex, setHex] = useState("#fff");

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTag = (tagName) => {
        setSelectedTags((prev) =>
            prev.includes(tagName)
                ? prev.filter((t) => t !== tagName)
                : [...prev, tagName],
        );
    };

    // Part type indexes:
    // 0 -> Motor
    // 1 -> Servo
    // 2 -> Structural
    // 3 -> Electrical
    // 4 -> Sensor
    // 5 -> 3D Printed
    // 6 -> Machined
    // 7 -> Other
    // 8 -> Wheel

    // *** MORE CAN BE ADDED ON LATER, JUST ADD TO THE INDEX, DO NOT REARRANGE *** //

    const [partType, setPartType] = React.useState(0);

    const renderStatContent = () => {
        switch (currentItem.stats.type) {
            case "motor":
                return <MotorList part={currentItem} />;
            case "servo":
                return <ServoList part={currentItem} />;
            case "structural":
                return <StructuralList part={currentItem} />;
            case "electrical":
                return <ElectricalList part={currentItem} />;
            case "sensor":
                return <SensorList part={currentItem} />;
            case "3d-printed":
                return <ThreeDPrintedList part={currentItem} />;
            case "machined":
                return <MachinedList part={currentItem} />;
            case "other":
                return <OtherList part={currentItem} />;
            default:
                return <MotorList part={currentItem} />;
        }
    };

    function handleTagManageOpen() {
        setIsManageTagPopupOpen(true);
        setIsBlockerOpen(true);
    }

    function handleTagManageClose() {
        setIsManageTagPopupOpen(false);
        setIsBlockerOpen(false);
    }

    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return "black";

        // Remove hash
        let cleanHex = hexcolor.replace("#", "");

        // Convert 3-digit hex (#fff) to 6-digit (#ffffff)
        if (cleanHex.length === 3) {
            cleanHex = cleanHex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // If it's not a valid 6-digit hex now, just return black
        if (cleanHex.length !== 6) return "black";

        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);

        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        return yiq >= 128 ? "black" : "white";
    };

    // Part type indexes:
    // 0 -> Motor
    // 1 -> Servo
    // 2 -> Structural
    // 3 -> Electrical
    // 4 -> Sensor
    // 5 -> 3D Printed
    // 6 -> Machined
    // 7 -> Other
    // 8 -> Wheel

    function onAddItemExitClick() {
        setIsAddItemOpen(false);
        const savedData = localStorage.getItem("partData");
        setListResults(savedData ? JSON.parse(savedData) : []);
    }

    const onRowClick = (item) => {
        const partTypeMap = {
            motor: 0,
            servo: 1,
            structural: 2,
            electrical: 3,
            sensor: 4,
            "3d-printed": 5,
            machined: 6,
            other: 7,
            wheel: 8,
        };

        setPartType(partTypeMap[item.stats.type]);

        setCurrentItem(item);
        setIsPartOverlayOpen(true);
        setCurrentQuant(item?.quantity);
        setCurrentNeeded(item?.needed);
    };

    const onExitClick = () => {
        setIsPartOverlayOpen(false);
        setCurrentItem(null);

        const savedData = localStorage.getItem("partData");
        setListResults(savedData ? JSON.parse(savedData) : []);

        setUsePartToRun(false);
    };

    const onTagExitClick = () => {
        setIsBlockerOpen(false);
        setIsCreateTagOpen(false);
    };

    const onTagOpenClick = () => {
        setIsBlockerOpen(true);
        setIsCreateTagOpen(true);
    };

    const [isEditingQuant, setIsEditingQuant] = useState(false);
    const [isEditingNeeded, setIsEditingNeeded] = useState(false);

    const handleDirectInputChange = (target, value) => {
        if (value > -1) {
            if (target === 0) {
                setCurrentQuant(value);
                updatePartData(currentItem.id, value, currentNeeded);
            } else {
                setCurrentNeeded(value);
                updatePartData(currentItem.id, currentQuant, value);
            }
        }
    };

    const handleNumChangeClick = (target, operation) => {
        if (target === 0) {
            const newQuant =
                operation === 0
                    ? Number(currentQuant) + 1
                    : Math.max(currentQuant - 1, 0);

            setCurrentQuant(newQuant);
            updatePartData(currentItem.id, newQuant, currentNeeded);
        } else {
            const newNeeded =
                operation === 0
                    ? Number(currentNeeded) + 1
                    : Math.max(currentNeeded - 1, 0);

            setCurrentNeeded(newNeeded);
            updatePartData(currentItem.id, currentQuant, newNeeded);
        }
    };
    const updatePartData = (id, newQuant, newNeeded) => {
        setListResults((prevList) => {
            const updatedList = prevList.map((part) => {
                if (part.id === id) {
                    return { ...part, quantity: newQuant, needed: newNeeded };
                }
                return part;
            });
            localStorage.setItem("partData", JSON.stringify(updatedList));
            return updatedList;
        });
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <RiExpandUpDownFill />;
        return sortConfig.direction === "asc" ? (
            <RiArrowUpSFill />
        ) : (
            <RiArrowDownSFill />
        );
    };

    const reloadPartsList = (sortKey) => {
        let direction = "asc";
        if (sortConfig.key === sortKey && sortConfig.direction === "asc")
            direction = "desc";

        const sorted = [...listResults].sort((a, b) => {
            let aVal = a[sortKey] ?? "";
            let bVal = b[sortKey] ?? "";

            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();

            if (aVal < bVal) return direction === "asc" ? -1 : 1;
            if (aVal > bVal) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setListResults(sorted);
        setSortConfig({ key: sortKey, direction });
    };

    const filteredResults = listResults.filter((item) => {
        // 1. Tag Filtering (Case-Insensitive)
        const matchesTags =
            selectedTags.length === 0 ||
            (item.tags &&
                item.tags.some((partTag) =>
                    selectedTags.some(
                        (selected) =>
                            selected.toLowerCase() === partTag.toLowerCase(),
                    ),
                ));

        if (!matchesTags) return false;

        // 2. Search Query Filtering
        const lowerQuery = query.toLowerCase();
        const matchesQuery =
            item.name.toLowerCase().includes(lowerQuery) ||
            (item.manufacturerId &&
                item.manufacturerId.toLowerCase().includes(lowerQuery));

        return matchesQuery;
    });

    useEffect(() => {
        onReset();
    }, []);

    useEffect(() => {
        if (usePartToRun) {
            onRowClick(partToRun);
        }
    }, []);

    return (
        <>
            <div className="d-homepagecontainer">
                <div className="d-titlecontainer">
                    <p>Parts</p>
                    <div className="d-inputwrapper">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="d-searchbar"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                <div className="d-partslistcontainer">
                    <div
                        className="d-titlecontainer-small"
                        id="d-partslistcontainertopbuttoncontainer"
                    >
                        {!isPhone ? (
                            <>
                                <button onClick={() => setIsAddItemOpen(true)}>
                                    + Add Item
                                </button>
                                <div className="d-titlecontainer-small-downloadwrapper">
                                    <button onClick={handleTagManageOpen}>
                                        <FaTags />
                                        <span style={{ marginLeft: 4 }}>
                                            Manage Tags
                                        </span>
                                    </button>
                                    <button>
                                        <MdDownload />
                                        <span style={{ marginLeft: 4 }}>
                                            JSON
                                        </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    style={{ fontSize: "3rem" }}
                                    onClick={() => setIsAddItemOpen(true)}
                                >
                                    + Add Item
                                </button>
                                <button
                                    style={{ fontSize: "3rem" }}
                                    onClick={handleTagManageOpen}
                                >
                                    <FaTags />
                                    <span style={{ marginLeft: 4 }}>
                                        Manage Tags
                                    </span>
                                </button>
                                <button style={{ fontSize: "3rem" }}>
                                    <MdDownload />
                                    <span style={{ marginLeft: 4 }}>JSON</span>
                                </button>
                                <div
                                    className="custom-tag-dropdown"
                                    style={{ maxWidth: "25%" }}
                                    ref={dropdownRef}
                                >
                                    <button
                                        type="button"
                                        className="d-dropdown-btn"
                                        style={{
                                            width: "100%",
                                            fontSize: "3rem",
                                        }}
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                    >
                                        <span>
                                            {selectedTags.length > 0
                                                ? `${selectedTags.length} Selected`
                                                : "Tags"}
                                        </span>
                                        {isDropdownOpen ? (
                                            <RiArrowUpSFill />
                                        ) : (
                                            <RiArrowDownSFill />
                                        )}
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="d-dropdown-menu"
                                            style={{ width: "20vw" }}
                                        >
                                            {/* Filter tags to only show those present in partData */}
                                            {tags
                                                .filter((tag) =>
                                                    // Checks if ANY part has this tag, ignoring capital letters
                                                    listResults.some(
                                                        (part) =>
                                                            part.tags &&
                                                            part.tags.some(
                                                                (t) =>
                                                                    t.toLowerCase() ===
                                                                    tag.name.toLowerCase(),
                                                            ),
                                                    ),
                                                )
                                                .map((tag) => (
                                                    <label
                                                        key={tag.name}
                                                        className="d-tag-label"
                                                        style={{
                                                            backgroundColor:
                                                                tag.color,
                                                            color: getContrastYIQ(
                                                                tag.color,
                                                            ),
                                                            width: "90%",
                                                            fontSize: "2.5rem",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="d-tag-checkbox"
                                                            checked={selectedTags.includes(
                                                                tag.name,
                                                            )}
                                                            style={{
                                                                height: "10px",
                                                                width: "10px",
                                                            }}
                                                            onChange={() =>
                                                                toggleTag(
                                                                    tag.name,
                                                                )
                                                            }
                                                        />
                                                        {tag.name}
                                                    </label>
                                                ))}

                                            <div
                                                className="d-add-button d-tag-label"
                                                onClick={onTagOpenClick}
                                                style={{
                                                    width: "87%",
                                                    boxSizing: "border-box",
                                                    fontSize: "2.5rem",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        marginRight: "12px",
                                                        lineHeight: 0,
                                                    }}
                                                >
                                                    +
                                                </span>
                                                Add Tag
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="d-partslistwrapper" id="partslistwrapper">
                        {!isPhone && (
                            <div className="d-partslistheader">
                                <div
                                    style={{
                                        width: "15%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            reloadPartsList("manufacturerId")
                                        }
                                    >
                                        Id {getSortIcon("manufacturerId")}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        width: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => reloadPartsList("name")}
                                    >
                                        Name {getSortIcon("name")}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        width: "15%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            reloadPartsList("quantity")
                                        }
                                    >
                                        Quantity {getSortIcon("quantity")}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        width: "15%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            reloadPartsList("needed")
                                        }
                                    >
                                        Needed {getSortIcon("needed")}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        width: "10%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        className="custom-tag-dropdown"
                                        ref={dropdownRef}
                                    >
                                        <button
                                            type="button"
                                            className="d-dropdown-btn"
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen,
                                                )
                                            }
                                        >
                                            <span>
                                                {selectedTags.length > 0
                                                    ? `${selectedTags.length} Selected`
                                                    : "Tags"}
                                            </span>
                                            {isDropdownOpen ? (
                                                <RiArrowUpSFill />
                                            ) : (
                                                <RiArrowDownSFill />
                                            )}
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="d-dropdown-menu">
                                                {/* Filter tags to only show those present in partData */}
                                                {tags
                                                    .filter((tag) =>
                                                        // Checks if ANY part has this tag, ignoring capital letters
                                                        listResults.some(
                                                            (part) =>
                                                                part.tags &&
                                                                part.tags.some(
                                                                    (t) =>
                                                                        t.toLowerCase() ===
                                                                        tag.name.toLowerCase(),
                                                                ),
                                                        ),
                                                    )
                                                    .map((tag) => (
                                                        <label
                                                            key={tag.name}
                                                            className="d-tag-label"
                                                            style={{
                                                                backgroundColor:
                                                                    tag.color,
                                                                color: getContrastYIQ(
                                                                    tag.color,
                                                                ),
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="d-tag-checkbox"
                                                                checked={selectedTags.includes(
                                                                    tag.name,
                                                                )}
                                                                onChange={() =>
                                                                    toggleTag(
                                                                        tag.name,
                                                                    )
                                                                }
                                                            />
                                                            {tag.name}
                                                        </label>
                                                    ))}

                                                <div
                                                    className="d-add-button d-tag-label"
                                                    onClick={onTagOpenClick}
                                                >
                                                    <span
                                                        style={{
                                                            marginRight: "12px",
                                                            fontSize: "1rem",
                                                            lineHeight: 0,
                                                        }}
                                                    >
                                                        +
                                                    </span>
                                                    Add Tag
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {filteredResults.map((item) => (
                            <PartItem
                                key={item.id}
                                part={item}
                                onRowClick={onRowClick}
                                onEdit={handleEditOpen}
                                onDelete={() =>
                                    setListResults(
                                        JSON.parse(
                                            localStorage.getItem("partData"),
                                        ) || [],
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isPartOverlayOpen && currentItem && (
                <div id="d-partoverlay" className="d-partoverlay">
                    {console.log(usePartToRunLocal)}
                    {usePartToRunLocal && (
                        <button
                            className="d-partoverlay-returnbutton"
                            onClick={onReturn}
                        >
                            &lt;
                        </button>
                    )}
                    <div className="leftcontainer">
                        <div className="thirdcontainer">
                            <div
                                className="d-titlecontainer"
                                style={{ paddingLeft: "5%", fontSize: "2rem" }}
                            >
                                <p>{currentItem?.name}</p>
                            </div>
                            <p className="d-partoverlay-subtitle">
                                ID: {currentItem.manufacturerId}
                            </p>
                            <p className="d-partoverlay-subtitle">
                                Manufacturer: {currentItem.manufacturer}
                            </p>
                            <img
                                src={currentItem?.icon}
                                alt={currentItem?.name}
                            />
                            <div className="d-partoverlay-infodiv1">
                                <p>Links:</p>
                                <ul>
                                    {currentItem?.links &&
                                        Object.entries(currentItem.links)
                                            .filter(([name, url]) => url)
                                            .map(([name, url]) => (
                                                <li key={name}>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {name}
                                                    </a>
                                                </li>
                                            ))}
                                </ul>
                            </div>
                        </div>

                        <div className="thirdcontainer">
                            <div className="d-partoverlay-infodiv1">
                                <p>Stats:</p>
                                {renderStatContent()}
                            </div>
                            <div className="d-partoverlay-infodiv1">
                                <div className="leftcontainer">
                                    <div className="halfcontainer">
                                        <div className="d-partoverlay-editquant">
                                            <button
                                                onClick={() =>
                                                    handleNumChangeClick(0, 1)
                                                }
                                            >
                                                −
                                            </button>
                                            {isEditingQuant ? (
                                                <input
                                                    type="number"
                                                    autoFocus
                                                    className="d-parts-directinput"
                                                    onBlur={() =>
                                                        setIsEditingQuant(false)
                                                    }
                                                    /* Press Enter to submit */
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            setIsEditingQuant(
                                                                false,
                                                            );
                                                    }}
                                                    onChange={(e) =>
                                                        handleDirectInputChange(
                                                            0,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p
                                                    onClick={() =>
                                                        setIsEditingQuant(true)
                                                    }
                                                >
                                                    Quantity: {currentQuant}
                                                </p>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleNumChangeClick(0, 0)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="halfcontainer">
                                        <div className="d-partoverlay-editquant">
                                            <button
                                                onClick={() =>
                                                    handleNumChangeClick(1, 1)
                                                }
                                            >
                                                −
                                            </button>
                                            {isEditingNeeded ? (
                                                <input
                                                    type="number"
                                                    autoFocus
                                                    className="d-parts-directinput"
                                                    onBlur={() =>
                                                        setIsEditingNeeded(
                                                            false,
                                                        )
                                                    }
                                                    /* Press Enter to submit */
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            setIsEditingNeeded(
                                                                false,
                                                            );
                                                    }}
                                                    onChange={(e) =>
                                                        handleDirectInputChange(
                                                            1,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <p
                                                    onClick={() =>
                                                        setIsEditingNeeded(true)
                                                    }
                                                >
                                                    Needed: {currentNeeded}
                                                </p>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleNumChangeClick(1, 0)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="thirdcontainer">
                            <div className="d-partoverlay-infodiv1">
                                <p>Tags:</p>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: "10px",
                                        listStyle: "none",
                                        marginTop: "10px",
                                    }}
                                >
                                    {currentItem?.tags?.map((tagName) => {
                                        const tagData = tags.find(
                                            (t) => t.name === tagName,
                                        );
                                        const bgColor = tagData
                                            ? tagData.color
                                            : "#ccc";
                                        const textColor =
                                            getContrastYIQ(bgColor);

                                        return (
                                            <div
                                                key={tagName}
                                                style={{
                                                    textTransform: "capitalize",
                                                    backgroundColor: bgColor,
                                                    color: textColor,
                                                    padding: "6px 10px",
                                                    borderRadius: "12px",
                                                    textAlign: "center",
                                                    fontSize: isPhone
                                                        ? "2.7rem"
                                                        : "0.75rem",
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    minHeight: "30px",
                                                }}
                                            >
                                                {tagName}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="d-partoverlay-exitbutton"
                        onClick={onExitClick}
                    >
                        X
                    </button>
                </div>
            )}
            {isBlockerOpen && <Blocker id="blocker1"></Blocker>}
            {isCreateTagOpen && (
                <div className="d-createtagoverlay">
                    <button
                        className="d-partoverlay-exitbutton"
                        onClick={onTagExitClick}
                    >
                        X
                    </button>
                    <p>Custom Tag</p>
                    {tagError && (
                        <p
                            style={{
                                color: "red",
                                margin: "0 0 5px 0",
                                fontSize: "0.9rem",
                            }}
                        >
                            {tagError}
                        </p>
                    )}
                    <input
                        id="createtaginput"
                        placeholder="Tag Name..."
                        value={newTagName}
                        onChange={(e) => {
                            setNewTagName(e.target.value);
                            setTagError("");
                        }}
                        style={{
                            border: tagError
                                ? "1px solid red"
                                : "1px solid #ccc",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                    <div className="d-custom-sketch-container">
                        <Sketch
                            color={hex}
                            disableAlpha={true}
                            onChange={(color) => setHex(color.hex)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            const trimmedName = newTagName.trim();

                            // 1 Check for empty input
                            if (!trimmedName) {
                                setTagError("Tag name cannot be empty");
                                return;
                            }

                            // 2 Check for duplicates
                            const isDuplicate = tags.some(
                                (tag) =>
                                    tag.name.toLowerCase() ===
                                    trimmedName.toLowerCase(),
                            );
                            if (isDuplicate) {
                                setTagError("Tag name already exists");
                                return;
                            }

                            // Add tag
                            addTag(trimmedName, hex);
                            setNewTagName(""); // reset input
                            setTagError(""); // clear any previous error
                        }}
                    >
                        Create Tag
                    </button>
                </div>
            )}

            {isAddItemOpen && (
                <AddItemMenuDesktop onClose={onAddItemExitClick} />
            )}

            {isManageTagPopupOpen && (
                <div className="d-createtagoverlay">
                    <button
                        className="d-partoverlay-exitbutton"
                        onClick={handleTagManageClose}
                    >
                        X
                    </button>
                    <p>Manage Tags</p>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            marginTop: "10px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                width: "100%",
                                maxWidth: "400px",
                            }}
                        >
                            {JSON.parse(localStorage.getItem("taglist") || "[]")
                                .filter((tag) => tag.deletable === true)
                                .map((tag) => {
                                    const bgColor = tag.color || "#ccc";
                                    const textColor = getContrastYIQ(bgColor);

                                    return (
                                        <div
                                            key={tag.name}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textTransform: "capitalize",
                                                    backgroundColor: bgColor,
                                                    color: textColor,
                                                    padding: "4px 12px",
                                                    borderRadius: "12px",
                                                    fontSize: isPhone
                                                        ? "3rem"
                                                        : "0.8rem",
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    minHeight: "30px",
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {tag.name}
                                            </div>

                                            <div
                                                className="d-partitem-iconbutton2"
                                                onClick={() =>
                                                    setDeletingTagName(tag.name)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                    width: "3rem",
                                                    height: "3rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    fontSize: "2.6rem",
                                                    color: "white",
                                                }}
                                            >
                                                <IoTrashSharp />
                                            </div>
                                            {deletingTagName === tag.name && (
                                                <WarningPopup
                                                    message={`This will delete ${tag.name}`}
                                                    complete={() => {
                                                        deleteTag(tag.name);
                                                        setDeletingTagName(
                                                            null,
                                                        );
                                                    }}
                                                    close={() =>
                                                        setDeletingTagName(null)
                                                    }
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {isEditPartOpen && (
                <>
                    <div id="d-partoverlay" className="d-partoverlay">
                        <button
                            className="d-partoverlay-exitbutton"
                            onClick={handleEditClose}
                        >
                            X
                        </button>
                        <div className="d-createitem-centercontainer">
                            <form
                                onSubmit={handleSubmit}
                                className="d-createitem-form"
                            >
                                <h3 className="d-createitem-form-subtitle">
                                    ({currentItem.manufacturerId}) -{" "}
                                    {currentItem.name}
                                </h3>

                                <hr className="d-createitem-form-divider"></hr>
                                <h4 className="d-createitem-form-subtitle2">
                                    Basic Info:
                                </h4>

                                <div className="d-createitem-input-group">
                                    <label>Name:</label>
                                    <input
                                        name="name"
                                        placeholder="e.g. NeveRest Orbital 20"
                                        value={formData?.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-createitem-input-group">
                                    <label>Manufacturer ID:</label>
                                    <input
                                        name="manufacturerId"
                                        placeholder="e.g. am-3637b"
                                        value={formData?.manufacturerId}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-createitem-input-group">
                                    <label>Manufacturer:</label>
                                    <input
                                        name="manufacturer"
                                        placeholder="e.g. Andymark"
                                        value={formData?.manufacturer}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-createitem-input-group">
                                    <label>Tags (Select all that apply):</label>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {availableTags.map((tag) => {
                                            const isSelected =
                                                formData?.tags?.includes(
                                                    tag.name,
                                                );

                                            const bgColor = isSelected
                                                ? tag.color || "#ccc"
                                                : "#333";

                                            const textColor = isSelected
                                                ? getContrastYIQ(bgColor)
                                                : "#888";

                                            return (
                                                <div
                                                    key={tag.name}
                                                    onClick={() =>
                                                        toggleEditTag(tag.name)
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                        padding: "6px 12px",
                                                        borderRadius: "15px",
                                                        fontSize: isPhone
                                                            ? "2.5rem"
                                                            : "0.75rem",
                                                        fontWeight: "bold",
                                                        textTransform:
                                                            "capitalize",
                                                        transition: "all 0.2s",
                                                        backgroundColor:
                                                            isSelected
                                                                ? tag.color
                                                                : "#333",
                                                        color: textColor,
                                                        border: `1px solid ${isSelected ? tag.color : "#444"}`,
                                                    }}
                                                >
                                                    {tag.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <hr className="d-createitem-form-divider"></hr>
                                {renderSpecificEditStatContent()}

                                <h4 className="d-createitem-form-subtitle2">
                                    Links:
                                </h4>

                                <div className="d-createitem-input-group">
                                    <label>Icon URL:</label>
                                    <input
                                        name="iconLink"
                                        value={formData.iconLink}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-createitem-input-group">
                                    <label>CAD Link:</label>
                                    <input
                                        name="cadLink"
                                        value={formData.cadLink}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-createitem-input-group">
                                    <label>Store Link:</label>
                                    <input
                                        name="storeLink"
                                        value={formData.storeLink}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="rowcontainer">
                                    <button
                                        type="submit"
                                        className="d-createitem-submit-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="d-createitem-submit-button"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PartsPageDesktop;
