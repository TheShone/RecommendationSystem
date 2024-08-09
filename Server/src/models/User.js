class User {
    constructor(id,name,surname,username,email,password,dateBirth,address)
    {
        this.id=id;
        this.name=name;
        this.surname=surname;
        this.username=username;
        this.email=email;
        this.password=password;
        this.dateBirth=dateBirth;
        this.address=address;
    }
}
module.exports=User;