module.exports.findBestSlots = function (meeting) {
    var availabilities = meeting.availabilities;
    var slots = [];

    availabilities.forEach(function (availability) {
        slots.push.apply(slots, availability.slots);
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
                extendedSlot = copySlot(slot);
            } else if (slotOverlapping(extendedSlot, slot)) {
                //extending existing extendedSlot
                if (extendedSlot.range[1] < slot.range[1]) {
                    extendedSlot.range[1] = slot.range[1];
                }
            } else {
                //extendedSlot ends, replaced by slot
                extendedSlots.push(extendedSlot);
                extendedSlot = copySlot(slot);
            }
        });
        extendedSlots.push(extendedSlot);

        extendedSlots.forEach(function (slot) {
            console.log("extendedSlots: " + slot.range);
        });

        //reverse extendedSlot -> bestSlot
        var bestSlot = copySlot(extendedSlots[0]);

        bestSlot.range[0] = meeting.range[0];
        extendedSlots.forEach(function (slot) {
            bestSlot.range[1] = slot.range[0];
            meeting.bestSlots.push(bestSlot);
            bestSlot.range[0] = slot.range[1];
        });
        bestSlot.range[1] = new Date(meeting.range[1].getTime() + 1000 * 60 * 60 * 24);
        meeting.bestSlots.push(bestSlot);

        meeting.bestSlots.forEach(function (slot) {
            console.log("bestSlots: " + slot.range);
        });

    }
};

function slotOverlapping(a, b) {
    return +a.range[0] <= +b.range[0] && +b.range[0] <= +a.range[1];
}

function copySlot(slot) {
    return {
        range: [new Date(slot.range[0]), new Date(slot.range[1])]
    };
}

function getClass(obj) {
    if (typeof obj === "undefined")
        return "undefined";
    if (obj === null)
        return "null";
    return Object.prototype.toString.call(obj)
        .match(/^\[object\s(.*)\]$/)[1];
}