@AdminConfig =
  name: Config.name
  collections :
    Posts: {
      color: 'red'
      icon: 'pencil'
      auxCollections: ['Attachments']
      tableColumns: [
              {label: 'Test',name:'title'}
              {label:'User',name:'owner',collection:'Users'}
            ]
    }

    RateLimit: {
      color: 'black'
      icon: 'plus'
      tableColumns: [
              {label: 'Name',name:'name'}
              {label: 'Duration',name:'duration'}
              {label:'Accuracy',name:'accuracy'}
              {label: 'Limit by',name:'limit_by'}
              {label: 'Limit',name:'limit'}
              {label: 'Distributed',name:'distributed'}
              {label: 'Response Headers',name:'response_headers'}
            ]
    }

    ApiUmbrellaUsers: {
      color: 'yellow'
      icon: 'pencil'
      tableColumns: [
              {label: 'Email',name:'email'}
              {label: 'First Name',name:'first_name'}
              {label: 'Last Name',name:'last_name'}
            ]
    }
    Comments: {
      color: 'green'
      icon: 'comments'
      auxCollections: ['Posts']
      tableColumns: [
              {label: 'Content';name:'content'}
              {label:'Post';name:'doc',collection: 'Posts',collection_property:'title'}
              {label:'User',name:'owner',collection:'Users'}
            ]
    }
  dashboard:
    homeUrl: '/dashboard'
    # widgets: [
    # 	{
    # 		template: 'adminCollectionWidget'
    # 		data:
    # 			collection: 'Posts'
    # 			class: 'col-lg-3 col-xs-6'
    # 	}
    # 	{
    # 		template: 'adminUserWidget'
    # 		data:
    # 			class: 'col-lg-3 col-xs-6'
    # 	}
    # ]
  autoForm:
          omitFields: ['createdAt', 'updatedAt']
