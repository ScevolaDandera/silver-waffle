const { Vector3 } = require("three");

class PlayerControls {
    
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.x = this.gameObject.position.x;
        this.y = this.gameObject.position.y;
        this.z = this.gameObject.position.z;

    }
    getKeyAction(key) {
        let intendedAction = 'idle';
        switch(key) {
            case 'w':
            intendedAction = 'forward';
            break;
            case 'a':
            intendedAction = 'left';
            break;
            case 'd':
            intendedAction = 'right';
            break;
            case 's':
            intendedAction = 'back';
            break;
        }
        return intendedAction;
    }
    keyDown(event) {
        const key = event.key.toString().toLowerCase();
       // console.log("Key Pressed:  ", key);
        const action = this.getKeyAction(key);
      // console.log("Start Action: ", action);
       this.x +=1;
       this.y +=1;
       this.z +=1;
    }

    keyUp(event) {
        const key = event.key.toString().toLowerCase();
        const action = this.getKeyAction(key);
    //   console.log("Stop Action: ", action);
    }

    setControls() {
     //   console.log(this.gameObject);
        document.onkeydown = this.keyDown.bind(this);
        document.onkeyup = this.keyUp.bind(this);
    }

    update() {
  //      console.log(this.x);
        return new Vector3(this.x, this.y, this.z);
    }



}
// const pcontrols = new PlayerControls();
module.exports = PlayerControls;