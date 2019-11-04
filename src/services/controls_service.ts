export function ClearControls(param: any) {
    Object.keys(param).forEach(x => {
        // callback fn(x):
        if (x.search("ngModel") > 0) {
            console.log("Processing: ", x, "=", param[x]);
            param[x] = null; 
        }
    })
}

