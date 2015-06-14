@AdminConfig =
  name: Config.name
  collections :
    Posts: {
      color: 'red'
      icon: 'pencil'
      auxCollections: ['Attachments']
      tableColumns: [
              {label: 'Title',name:'title'}
              {label:'User',name:'owner',collection:'Users'}
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
    ApiBackends: {
      color: 'blue'
      icon: 'gear'
      tableColumns: [
              {label: 'Name',name:'name'}
              {label: 'Backend Host',name:'backend_host'}
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
