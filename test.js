$(".going, .maybe, .notgoing").click(function() {
    dataString = {"id": $(this).closest(".btn-group").attr("data-id"), "participation": $(this).find("input").val()};
    target = $(this);
    $.ajax({
        type: "POST",
        url: "/eventParticipation",
        data: dataString,
        success: function() {
            // does nothing
        }
    });
});

class EventParticipationHandler(BaseSessionHandler):
    def post(self):
        user = self.get_user_from_session()

        event = Events.get_by_id(int(self.request.get("id")))

        new = True

        for guest in event.event_guests:
            if user.user_id == guest.guest_id:
                guest.guest_status = self.request.get("participation")
                new = False

        if new == True:
            event.event_guests += [Guests(guest_id = user.user_id,
                                          guest_status = self.request.get("participation"),
                                          guest_permissions = "guest")]

        event.put()