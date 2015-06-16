@AdminConfig =
  name: Config.name
  collections :
    Posts: {
      color: 'red'
      icon: 'pencil'
      auxCollections: ['Attachments']
      tableColumns: [
<<<<<<< HEAD
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

=======
              {label: 'Title',name:'title'}
              {label:'User',name:'owner',collection:'Users'}
            ]
    }
>>>>>>> develop
    ApiUmbrellaUsers: {
      color: 'yellow'
      icon: 'pencil'
      tableColumns: [
              {label: 'Email',name:'email'}
              {label: 'First Name',name:'first_name'}
              {label: 'Last Name',name:'last_name'}
            ]
    }
<<<<<<< HEAD
=======
    ApiBackends: {
      color: 'blue'
      icon: 'gear'
      tableColumns: [
        {label: 'Name', name: 'name'}
        {label: 'Backend Host', name: 'backend_host'}
      ]
    }
    ApiUmbrellaAdmins: {
      color: 'blue'
      icon: 'user-md'
      tableColumns: [
              {label: 'Email',name:'email'}
              {label: 'Username',name:'username'}
            ]
    }
>>>>>>> develop
    Comments: {
      color: 'green'
      icon: 'comments'
      auxCollections: ['Posts']
      tableColumns: [
<<<<<<< HEAD
              {label: 'Content';name:'content'}
              {label:'Post';name:'doc',collection: 'Posts',collection_property:'title'}
              {label:'User',name:'owner',collection:'Users'}
=======
              {label: 'Content', name:'content'}
              {label:'Post', name:'doc',collection: 'Posts',collection_property:'title'}
              {label:'User', name:'owner',collection:'Users'}
>>>>>>> develop
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
