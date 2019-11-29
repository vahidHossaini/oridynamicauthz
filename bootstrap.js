module.exports = class paymentBootstrap{
  constructor(config)
  {
    this.funcs=[
		{
			  name:'getMyAccess',
			  title1:'' 
		},
		{
			  name:'getAccessName',
			  title:'دیدن دسترسی ها' 
		},
		{
			  name:'getRoles',
			  title:'دیدن نقش ها' 
		},
		{
		  name:'saveRole',
		  title:'ذخیره نقش ها' ,
		  captcha:true,
		  inputs:[
			{
			  name:'role',
			  type:'roleModel',
			  nullable:false
			}
		  ]
		},
		{
		  name:'checkRole',
		  title1:'checkRole' 
		},
    ]
    this.auth=[
		{
			role: "login",
			name: 'getMyAccess'
		}
	]
  }
}