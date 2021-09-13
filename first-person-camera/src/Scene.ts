import "cannon";
import * as BABYLON from "@babylonjs/core";

export default class Scene {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(canvasElement: string) {
    // Create canvas and engine.
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);

    // Create a basic BJS Scene object.
    this._scene = new BABYLON.Scene(this._engine);

    this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);
    this._scene.collisionsEnabled = true;
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    this._scene.enablePhysics(new BABYLON.Vector3(0, -0.75, 0), physicsPlugin);

    // Parameters : name, position, scene
    var camera = new BABYLON.UniversalCamera(
      "UniversalCamera",
      new BABYLON.Vector3(0, 2, -25),
      this._scene
    );

    // Targets the camera to a particular position. In this case the scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // Attach the camera to the canvas
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(0.4, 0.8, 0.4);
    camera.checkCollisions = true;
    camera.attachControl(this._canvas, true);

    //Hero

    var hero = BABYLON.Mesh.CreateBox(
      "hero",
      2.0,
      this._scene,
      false,
      BABYLON.Mesh.FRONTSIDE
    );
    hero.position.x = 0.0;
    hero.position.y = 1.0;
    hero.position.z = 0.0;
    hero.physicsImpostor = new BABYLON.PhysicsImpostor(
      hero,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 1, restitution: 0.0, friction: 0.1 },
      this._scene
    );
    // hero.physicsImpostor.physicsBody.fixedRotation = true;
    // hero.physicsImpostor.physicsBody.updateMassProperties();

    // pointer
    var pointer = BABYLON.Mesh.CreateSphere(
      "Sphere",
      16.0,
      0.01,
      this._scene,
      false,
      BABYLON.Mesh.DOUBLESIDE
    );
    // move the sphere upward 1/2 of its height
    pointer.position.x = 0.0;
    pointer.position.y = 0.0;
    pointer.position.z = 0.0;
    pointer.isPickable = false;

    var moveForward = false;
    var moveBackward = false;
    var moveRight = false;
    var moveLeft = false;

    var onKeyDown = function (event: KeyboardEvent) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;

        case 37: // left
        case 65: // a
          moveLeft = true;
          break;

        case 40: // down
        case 83: // s
          moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          moveRight = true;
          break;

        case 32: // space
          break;
      }
    };

    var onKeyUp = function (event: KeyboardEvent) {
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;

        case 37: // left
        case 65: // a
          moveLeft = false;
          break;

        case 40: // down
        case 83: // a
          moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    this._scene.registerBeforeRender(function () {
      //Your code here
      //Step
          //let stats = document.getElementById("stats");
          //stats.innerHTML = "";             

      camera.position.x = hero.position.x;
      camera.position.y = hero.position.y + 1.0;
      camera.position.z = hero.position.z;
      pointer.position = camera.getTarget();
      
      var forward = camera.getTarget().subtract(camera.position).normalize();
      forward.y = 0;
      var right = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();
      right.y = 0;
      
      var SPEED = 20;
      let f_speed = 0;
      var s_speed = 0;
      var u_speed = 0;			

      if (moveForward) {
          f_speed = SPEED;
      }
      if (moveBackward) {
          f_speed = -SPEED;
      }

      if (moveRight) {
          s_speed = SPEED;
      }

      if (moveLeft) {
          s_speed = -SPEED;
      }
      
      var move = (forward.scale(f_speed)).subtract((right.scale(s_speed))).subtract(camera.upVector.scale(u_speed));
      
      hero.physicsImpostor.physicsBody.velocity.x = move.x;
      hero.physicsImpostor.physicsBody.velocity.z = move.z;
      hero.physicsImpostor.physicsBody.velocity.y = move.y;
      
  });

    // Create a basic light, aiming 0,1,0 - meaning, to the sky.
    this._light = new BABYLON.HemisphericLight(
      "light1",
      new BABYLON.Vector3(0, 1, 0),
      this._scene
    );

    // Create a built-in "ground" shape.
    let ground = BABYLON.MeshBuilder.CreateGround(
      "ground1",
      { width: 6, height: 6, subdivisions: 2 },
      this._scene
    );
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}
