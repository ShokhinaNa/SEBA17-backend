module.exports.findBestSlots = function (meeting) {
    var availabilities = meeting.availabilities;
    var slots = [];

    availabilities.forEach(function (availability) {
        slots.push.apply(slots, availability.slots);
    });

    slots.forEach(function (slot) {
        console.log("Slots: " + slot.range);
    });

    console.log("SIZE " + slots.length);

    if (slots.length > 0) {
        slots.sort(function (a, b) {
            return new Date(a.range[0]) - new Date(b.range[0]);
        });


        meeting.bestSlots = [];
        var extendedSlots = [];
        var extendedSlot = null;
        slots.forEach(function (slot) {
            if (!extendedSlot) {
                extendedSlot = shallowCopy(slot);
            } else if (slotOverlapping(extendedSlot, slot)) {
                //extending existing extendedSlot
                extendedSlot.range[1] = slot.range[1];
            } else {
                //extendedSlot ends, replaced by slot
                extendedSlots.push(extendedSlot);
                extendedSlot = shallowCopy(slot);
            }
        });
        extendedSlots.push(extendedSlot);

        //reverse extendedSlot -> bestSlot
        var bestSlot = shallowCopy(extendedSlots[0]);

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
};

function slotOverlapping(a, b) {
    return b.range[0] >= a.range[0] && b.range[0] <= a.range[1];
}

function shallowCopy(o) {
    return JSON.parse(JSON.stringify(o));
}
