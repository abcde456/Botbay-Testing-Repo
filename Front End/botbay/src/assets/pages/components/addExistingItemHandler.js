function handleManufacturer(num) {
    if (num == 1) {
        return "Andymark";
    } else if (num == 2) {
        return "Rev";
    } else if (num == 3) {
        return "Gobilda";
    }
}

export function handlerAddMotor(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newMotor = {
        editable: true,
        manufacturerId: data.id,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "motor",
            connector_types: null,
            max_power: null,
            stall_current: null,
            voltage: null,
            output_shaft_length: null,
            no_load_speed: null,
            cpr: null,
            ppr: null,
            stall_torque: null,
            shaft_type: "",
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newMotor);
}

export function handlerAddServo(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newServo = {
        editable: true,
        manufacturerId: data.id,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "servo",
            size: [null, null, null],
            weight: null,
            speed: null,
            angular_range: null,
            gear_material: "",
            spline_type: "",
            spline_thread_type: "",
            spline_internal_depth: null,
            stall_current: null,
            stall_torque: null,
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newServo);
}

export function handlerAddStructural(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newStructural = {
        editable: true,
        manufacturerId: data.id,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "structural",
            size: [null, null, null],
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newStructural);
}

export function handlerAddElectrical(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newElectrical = {
        editable: true,
        manufacturerId: data.id,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "electrical",
            capacity: null,
            voltage: null,
            weight: null,
            wire_gauge: null,
            size: [null, null, null],
            connector_types: [],
            replaceable_fuse: null,
            max_discharge: null,
            wire_length: null,
            charge_rates: null,
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newElectrical);
}

export function handlerAddSensor(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newSensor = {
        editable: true,
        manufacturerId: data.id,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "sensor",
            sensor_type: null,
            max_operating_voltage: null,
            size: [null, null, null],
            proximity_sensor_range: null,
            distance_sensor_range: null,
            fov: null,
            imu: null,
            cpr: null,
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newSensor);
}

export function handlerAdd3DPrinted(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newPrint = {
        editable: true,
        manufacturerId: data.id || null,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "3d-printed",
            size: [null, null, null],
            infill: null,
            filament: null,
            wall_loops: null,
            infill_pattern: null,
            support: false,
            support_type: null,
            on_buildplate_only: false,
            remove_small_overhangs: false,
            threshold_angle: null,
            brim_type: null,
            brim_width: null,
            brim_object_gap: null,
            filament_amount: null,
            cost: null,
            time: [null, null],
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newPrint);
}

export function handlerAddMachined(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newMachined = {
        editable: true,
        manufacturerId: data.id || null,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "machined",
            size: [null, null, null],
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newMachined);
}

export function handlerAddOther(data, createNewItem) {
    var manufacturer = handleManufacturer(data.manufacturer);

    const newOther = {
        editable: true,
        manufacturerId: data.id || null,
        name: data.name,
        manufacturer: manufacturer,
        tags: [],
        stats: {
            type: "other",
            description: "",
        },
        quantity: 0,
        needed: 0,
        icon: data.img,
        links: {
            CAD: data.cad,
            Store: data.store,
        },
    };

    createNewItem(newOther);
}
