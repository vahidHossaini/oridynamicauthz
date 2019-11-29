module.exports = class dynamicAuthzConfig
{
  constructor(config,dist)
  {
    this.config=config.statics
    this.context=this.config.context 
  }
  //private
  async reload(self)
  {
	  self.roles=[];
	  var r=await global.db.Search(self.context,'dynamicRoles',{ },{} ); 
	  for(var a of r.value)
		self.roles.push({id:a.id,data:JSON.parse(a.data)})
  }
  //public
  async getMyAccess(msg,func,self)
  {
	  var r={}
    let session=msg.session
	if(!self.roles)
		await self.reload(self);
		 console.log('-------------------------->',self.roles)
	for(var a of self.roles)
	{
		if((session.roles & Math.pow(2,a.id)) || session.isAdmin)
			for(var b in a.data)
				if(session.isAdmin)
					r[b]=true
				else
					r[b]=a.data[b]
	}
    return func(null,r)
  }
  async getAccessName(msg,func,self)
  {
	  console.log('-----',global.auth )
    return func(null,global.authz)
  }
  async attachRole(msg,func,self)
  {
	var dt=msg.data
	var role=dt.role;
	var userid=dt.userid;
	var access=dt.access;
	var fromTime=dt.fromTime;
	var toTime=dt.toTime;
	
	var attrole=await global.db.SearchOne(self.context,'dynamicRoles_attach',{where:{_id:userid}});
	if(!attrole)
	{
		attrole={_id:userid,data:{}}
	}
	attrole.data[role]={userid,access,fromTime,toTime};
	await global.db.Save(self.context,'dynamicRoles_attach',["_id"],attrole)
	return func(null,true);
  }
  async getRoles(msg,func,self)
  {
	var dt=msg.data
	var roles=await global.db.Search(self.context,'dynamicRoles',{ },dt );
	await self.reload(self);
    return func(null,roles)
  }
  async saveRole(msg,func,self)
  {
	var dt=msg.data
	var role=dt.role
	if(role._id)
	{
		delete role._id
	}
	else
	{
		var mrole=await global.db.SearchOne(self.context,'dynamicRoles',{order:[["id","DESC"]]});
		console.log('--->',mrole)
		if(mrole==null)
		{
			role.id=0
		}
		else
		{
			role.id=mrole.id+1;
		}
	}
	await global.db.Save(self.context,'dynamicRoles',["id"],role)
	return  func(null,true)
  }
   //internal
  async checkRole(msg,func,self)
  {
    let dt=msg.data
    let session=msg.session
	
		// console.log('-------------------------->',self.roles)
		// console.log('-------------------------->',session)
		
    if(!session)session={}
    if( session.isAdmin)
    {
		return func(null,true)
    }
	if(!self.roles)
		await self.reload(self);
    var acc=global.auth[dt.domain] 
    if(acc && acc[dt.service])
    {
		if(acc[dt.service]=='public')
			return func(null,true)
		if(acc[dt.service]=='login')
		{
			if(!session.userid)
				return func(null,false)
			return func(null,true)
		}
	  
		if(!session.roles)
			return func(null,false)
		
		for(var a of self.roles)
		{
			if((session.roles & Math.pow(2,a.id)))
				if(a.data[dt.domain+"_"+dt.service])
					return func(null,true);
		}
		var attrole=await global.db.SearchOne(self.context,'dynamicRoles_attach',{where:{_id:session.userid}})
		if(attrole && attrole.data[dt.domain+"_"+dt.service])
		{
			var acc=attrole.data[dt.domain+"_"+dt.service];
			var now=new Date();
			if(acc.fromTime<now && acctoTime>now )
				return func(null,acc.access)
			else
			{
				if(acctoTime<now)
				{
					delete attrole.data[dt.domain+"_"+dt.service];
					await global.db.Save(self.context,'dynamicRoles_attach',["_id"],attrole)
				}
			}				
		}
        return func(null,false) 
    }    
    return func(null,false)  
  }
}