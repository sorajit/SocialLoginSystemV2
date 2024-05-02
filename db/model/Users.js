const Users = ( sequelize , Sequelize ) => {sequelize.define(
    'Users', //ชื่อของ model 
    {
      //attributes ต่างๆ ซึ่งจะตั้งให้สอดคล้องกับ User ในที่นี้คือ id username hash salt
      sid: { type: Sequelize.INTEGER(), primaryKey: true, autoIncrement: true, field: 'sid' },//ตั้งเป็น primary key และกำหนดให้มีค่าเพิ่มขึ้นเองเมื่อมีข้อมูลเพิ่ม
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true, field: 'username' },
      email:{type: Sequelize.STRING(50), allowNull: false, field: 'email'},
      hash: { type: Sequelize.STRING(), allowNull: false, field: 'hash' },
      salt: { type: Sequelize.STRING(), allowNull: false, field: 'salt' },
    },
    { 
      // ส่วนของ option ในที่นี้จะปิดการเพิ่ม timestamp
      //หากไม่กำหนดค่าในส่วนนี้เป็น false sequelize จะเป็น attributes createdAt และ updatedAt ให้โดยอัตโนมัติ
      timestamps: false,
      createdAt: false, 
      updatedAt: false, 
      tableName: 'sessions' // กำหนดชื่อตาราง
    }
  );
}

module.exports = Users;