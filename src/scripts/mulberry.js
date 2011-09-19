enyo.kind({
  name: "Kapoq.Mulberry",
  kind: enyo.VFlexBox,
  create: function() {
    this.inherited(arguments);
    this.togglePolling();
    this.doFetchDepartures();
  },
  doFetchDepartures: function() {
    this.$.fetchDepartures.call();
    if(this.poll) {
      enyo.job("fetchDepartures", enyo.bind(this, "doFetchDepartures"), 1000);
    }
  },
  renderDepartures: function(sender, response) {
    this.results = [];
    for(key in response) {
      travel_service = response[key];
      if(travel_service.departures)
        this.results.push(travel_service);
    }
    this.$.list.render();
  },
  fetchDeparturesFailure: function(sender, response) {
    enyo.log("error:", sender, response);
  },
  getListItem: function(sender, index) {
    if(enyo.isArray(this.results)) {
      var r = this.results[index];
      if (r) {
        this.$.title.setCaption(r.description);
        this.$.description.setContent(r.departures);
        return true;
      }
    }
  },
  togglePolling: function() {
    this.poll = !this.poll
    if(this.poll) {
      this.doFetchDepartures();
    }
    return this.poll;
  },
  components: [
    {
      name: "fetchDepartures", 
      kind: "WebService",
      url: "mock/departures.json",
      onSuccess: "renderDepartures",
      onFailure: "fetchDeparturesFailure"
    },
    { kind: "PageHeader", content: "Mulberry Departure Board" },
    { kind: "ToggleButton", onLabel: "Live updates on ", offLabel: "Live updates off", 
      state: true, 
      onChange: "togglePolling"
    },
    { kind: "Scroller", flex: 1, components: [
      { name: "list", kind: "VirtualRepeater", 
        onSetupRow: "getListItem",
        components: [
          { kind: "Item", layoutKind: "VFlexLayout", components: [
            { name: "title", kind: "Divider" },
            { name: "description" }
          ]}
        ]
      }
    ]}
  ]
});
