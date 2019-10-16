export class approval_profile_model {
  constructor(
    public id: number = null,
    public approver: string = null
  ) { }


  static fromJson(json: any) {
    if (!json) return;
    return new approval_profile_model(
      json.id,
      json.approver
    );
  }

  toJson(stringify?: boolean): any {
    var doc = {
      id: this.id,
      Approver: this.approver
    };
    return stringify ? JSON.stringify({ resource: [doc] }) : doc;
  }
}
