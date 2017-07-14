module.exports.findBestSlots = function (meeting) {
    var availabilities = meeting.availabilities;
    var slots = [];

    availabilities.forEach(function (availability) {
        if (slots === []) slots = availability.slots;
        else slots.push.apply(slots, availability.slots);
    });

    if (slots.length > 0) {
        slots.sort(function (a, b) {
            return new Date(a.range[0]) - new Date(b.range[0]);
        });

        console.log("SORTED");

        meeting.bestSlots = [];
        var extendedSlots = [];
        var extendedSlot = {range:[new Date(), new Date()]};
        slots.forEach(function (slot) {
            if (slotOverlaping(extendedSlot, slot)) {
                //extending existing extendedSlot
                if (slot.range[1] > extendedSlot.range[1])
                    extendedSlot.range[1] = slot.range[1];
            } else {
                //extendedSlot ends, replaced by slot
                extendedSlots.push(extendedSlot);
                extendedSlot = slot;
            }
        });
        extendedSlots.push(extendedSlot);
        extendedSlots.forEach(function (slot) {
            console.log("extendedSlots: " + slot.range[0].toLocaleString() + " " + slot.range[1].toLocaleString());
        });

        //reverse extendedSlot -> bestSlot
        var bestSlot = extendedSlots[0];
        bestSlot.range[0] = meeting.range[0];
        extendedSlots.forEach(function (slot) {
            bestSlot.range[1] = slot.range[0];
            meeting.bestSlots.push(bestSlot);
            bestSlot.range[0] = slot.range[1];
        });
        bestSlot.range[1] = meeting.range[1];
        meeting.bestSlots.push(bestSlot);

        meeting.bestSlots.forEach(function (slot) {
            console.log("bestSlots: " + slot.range[0].toLocaleString() + " " + slot.range[1].toLocaleString());
        });

    }
}

function slotOverlaping(a,b){
    if(b.range[0] >= a.range[0] && b.range[0] <= a.range[1])
        return true;
    return false;
}
