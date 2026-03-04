// THIS IS THE FILE TO INTERACT WITH ALL SUPABASE DATABASE FUNCTIONS, AUTH ONES WILL BE IN A SEPARATE FILE

/// ~~~ PARTS RELATED ~~~ ///

function overwritePart(group, part) {}

function createPart(group, part) {}

function deletePart(group, partId) {}

function readAllParts(group) {}

function readPart(group, part) {}

/// ~~~ BATTERY RELATED ~~~ ///

function deleteBattery(group, battery) {}

function createBattery(group, battery) {}

function readAllBatteries(group) {}

/// ~~~ TAGS RELATED ~~~ ///

function deleteTag(group, tag) {}

function createTag(group, tag) {}

function readAllTags(group) {}
