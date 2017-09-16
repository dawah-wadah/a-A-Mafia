export default class Role {
  constructor(options){
    this.name = options.name;
    this.roleType= options.roleType;
    this.isDead = false;
    this.isAttacked = false;
    this.isProtected = false;
    this.isInvestigate = false;
    this.isJailed = false;
    this.isFramed = false;
    this.wills = {
      will: '',
      kill_note: ''
    };
  }
}
