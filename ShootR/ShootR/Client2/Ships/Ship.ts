/// <reference path="../../Scripts/endgate-0.2.0-beta1.d.ts" />
/// <reference path="../Server/IPayloadDefinitions.ts" />
/// <reference path="Abilities/AbilityHandlers/ShipAbilityHandler.ts" />
/// <reference path="Graphics/ShipGraphic.ts" />
/// <reference path="Animations/ShipAnimationHandler.ts" />
/// <reference path="ShipMovementController.ts" />
/// <reference path="ShipLifeController.ts" />

module ShootR {

    export class Ship extends eg.Collision.Collidable {
        public static SIZE: eg.Size2d = new eg.Size2d(75, 75);

        public ID: number;
        public Graphic: ShipGraphic;
        public MovementController: ShipMovementController;
        public AbilityHandler: ShipAbilityHandler;
        public AnimationHandler: ShipAnimationHandler;
        public LifeController: ShipLifeController;

        constructor(payload: Server.IShipData, contentManager: eg.Content.ContentManager) {
            this.LifeController = new ShipLifeController();
            this.Graphic = new ShipGraphic(this.LifeController, payload.MovementController.Position, Ship.SIZE, contentManager);

            // Going to use the rectangle to "hold" all the other graphics
            super(this.Graphic.GetDrawBounds());

            this.MovementController = new ShipMovementController(new Array<eg.IMoveable>(this.Bounds, this.Graphic));
            this.AbilityHandler = new ShipAbilityHandler(this);            
            this.AnimationHandler = new ShipAnimationHandler(this, contentManager);

            this.LoadPayload(payload);
        }

        public Update(gameTime: eg.GameTime): void {
            this.AbilityHandler.Update(gameTime);
            this.MovementController.Update(gameTime);
            this.AnimationHandler.Update(gameTime);

            // Updates rotation
            this.Graphic.RotateShip(this.MovementController.Rotation);
        }

        public LoadPayload(payload: Server.IShipData): void {
            this.ID = payload.ID;
            this.MovementController.LoadPayload(payload.MovementController);
            this.LifeController.LoadPayload(payload);
        }

        public Destroy(): void {
            this.Graphic.Dispose();
            this.Dispose();
        }
    }

}