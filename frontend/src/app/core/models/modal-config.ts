export enum TypeModalConfigEnum {
  advise = 'advise',
  great = 'great'
}

export const TypeModalConfig = {
  [TypeModalConfigEnum.advise]: {
    title: 'warning',
    icon: 'warning',
    color: 'advise'
  },
  [TypeModalConfigEnum.great]: {
    title: 'great',
    icon: 'mood',
    color: 'success',
    message: 'succeed'
  }
}
export class ModalConfig {
  public static TYPE_ADVISE = new ModalConfig(TypeModalConfig[TypeModalConfigEnum.advise]);
  public static TYPE_GREAT = new ModalConfig(TypeModalConfig[TypeModalConfigEnum.great]);

  public title!: string;
  public message!: string;
  public messageExtra: { [key: string]: any } = {};
  public type:any  = TypeModalConfig[TypeModalConfigEnum.advise];
  public isYes: boolean = true;
  public buttonYes: string = 'yes';
  public isNo: boolean = true;
  public buttonNo: string = 'no';
  public width?: string;
  public height?: string;


  constructor(type?: any) {
    this.type = type
  }

  static newModalConfig(title: string, message: string, messageExtra?: { [key: string]: any }) {
    const mc = new ModalConfig();
    mc.title = title;
    mc.message = message;
    if (messageExtra) {
      mc.messageExtra = messageExtra;
    }
    return mc;
  }
}
