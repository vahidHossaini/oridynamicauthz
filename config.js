module.exports = class staticAuthzConfig
{
    constructor(config)
    { 
         
    }
    getPackages()
    {
       return []
    }
    
    getVersionedPackages()
    { 
      return []
    }
    geInternaltPackages()
    {
       return ['account']
    }


    getVersion()
    {
      return '0.0.1'
    }
    getDefaultConfig()
    {
      return {
        roles:{
          admin:0x00000001, 
          user:0x00000002,
          userAuth:0x0000004,
        }
      }
    }
}