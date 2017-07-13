module.exports.findBestSlots = function (meeting) {
    var availabilities = meeting.availabilities;
    var slots;

    availabilities.forEach(function (availability) {
        if (slots === undefined || slots === null) slots = availability.slots
        else slots.concat(availability.slots);
        console.log("availability slots: " + availability.slots);
    });
    console.log("SIZE " + slots.length);

    // slots.forEach(function (slot) {
    //     console.log("slot: " + slot.range[0].toLocaleString()+ " " + slot.range[1].toLocaleString());
    // });
    slots.sort(function (a, b) {
        return new Date(a.range[0]) - new Date(b.range[0]);
    });

    console.log("SORTED");
    // slots.forEach(function (slot) {
    //     console.log("slot1: " + slot.range[0].toLocaleString()+ " " + slot.range[1].toLocaleString());
    // });
    meeting.bestSlots = []
    var bestslot = slots[0];
    slots.forEach(function (slot) {
        //console.log("sort slot: "+ slot.range[0].toLocaleString()+ " " + slot.range[1].toLocaleString());
        if(slotOverlaping(bestslot, slot)){
            //extending existing bestslot
            if(slot.range[1] > bestslot.range[1])
                bestslot.range[1] = slot.range[1];
        } else {
            //bestslot ends, replaced by slot
            meeting.bestSlots.push(bestslot);
            bestslot = slot;
        }
    });
    meeting.bestSlots.push(bestslot);
    meeting.bestSlots.forEach(function (slot) {
        console.log("bestslot: " + slot);
    });


    meeting.bestSlots.forEach(function (slot) {
        console.log("bestslot: " + slot.range[0].toLocaleString()+ " " + slot.range[1].toLocaleString());
    });


}

function slotOverlaping(a,b){
    if(b.range[0] >= a.range[0] && b.range[0] <= a.range[1])
        return true;
    return false;
}
