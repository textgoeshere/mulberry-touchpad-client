enyo.kind({
  name: "Kapoq.Mulberry",
  kind: enyo.VFlexBox,
  create: function() {
    this.inherited(arguments);
    this.results = [];
    this.$.fetchDepartures.setUrl("mock/departures.json")
    this.$.fetchDepartures.call();
  },
  departures: function(sender, response) {
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
    var r = this.results[index];
    console.log("getListItem", index, r);
    if (r) {
      this.$.title.setCaption(r.description);
      this.$.description.setContent(r.departures);
      return true;
    }
  },
  components: [
    {
      name: "fetchDepartures", 
      kind: "WebService",
      onSuccess: "departures",
      onFailure: "fetchDeparturesFailure"
    },
    {
      kind: "PageHeader", 
      content: "Mulberry Departure Board" 
    },
    {kind: "Scroller", flex: 1, components: [
      {name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem",
       components: [
         {kind: "Item", layoutKind: "VFlexLayout", components: [
           {name: "title", kind: "Divider"},
           {name: "description"}
         ]}
       ]
      }
    ]}    
  ]
});
