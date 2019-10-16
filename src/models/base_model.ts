export class Base_Model {
    constructor(
    ) { }
    public CREATION_TS: string = null;
    public CREATION_USER_GUID: string = null;
    public UPDATE_TS: string = null;
    public UPDATE_USER_GUID: string = null;
}

export class Base_Activation_Model extends Base_Model {
    constructor(
//		public ACTIVATION_FLAG: string = null
    ) {
        super();
    }
    public ACTIVATION_FLAG: string | number = null;
}

export class Base_NameDescription_Model extends Base_Model {
    constructor()
    {
        super();
    }
    public NAME: string = null;
	public DESCRIPTION: string = null;
}