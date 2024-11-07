import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Orders', () => {
    it('should be defined', () => {
      expect(controller.createOrder).toBeDefined();
    });
  });

  describe('Cancel Orders', () => {
    it('should be defined', () => {
      expect(controller.cancelOrder).toBeDefined();
    });
  });

  describe('Update Orders', () => {
    it('should be defined', () => {
      expect(controller.updateOrder).toBeDefined();
    });
  });

  describe('Get Single Order', () => {
    it('should be defined', () => {
      expect(controller.getOrder).toBeDefined();
    });
  });

  describe('Get All Orders', () => {
    it('should be defined', () => {
      expect(controller.getAllOrders).toBeDefined();
    });
  });
});
