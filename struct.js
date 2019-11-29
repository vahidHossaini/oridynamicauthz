module.exports={
  roleModel:{
    struct:{
      _id:{type:'string',nullable:true},
      id:{type:'number',nullable:true},
      title:{type:'string',nullable:false},
      active:{type:'boolean',nullable:false},
      data:{type:'string'}, 
    }
    
  }
}