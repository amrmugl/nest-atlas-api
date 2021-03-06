import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, userId: number, hotelId: number) {
    const hotel = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          Booking: {
            create: {
              startingDate: dto.startingDate,
              endingDate: dto.endingDate,
              rooms: dto.rooms,
              userId: userId,
            },
          },
        },
        include: {
          Booking: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to create booking', 400);
        }
      });
    if (hotel) {
      return hotel.Booking;
    }
  }

  async findAll(userId: number) {
    const allbookings = await this.prisma.booking
      .findMany({ where: { userId } })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find bookings');
        }
      });
    return allbookings;
  }

  async findOne(bookingId: number) {
    const booking = await this.prisma.booking
      .findUnique({
        where: {
          id: bookingId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find booking with given id');
        }
      });
    return booking;
  }

  async update(
    dto: Partial<CreateBookingDto>,
    userId: number,
    hotelId: number,
  ) {
    const booking = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          Booking: {
            update: {
              startingDate: dto.startingDate,
              endingDate: dto.endingDate,
              rooms: dto.rooms,
            },
          },
        },
        include: {
          Booking: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to update booking', 400);
        }
      });
    if (booking) {
      return booking.Booking;
    }
  }

  async remove(bookingId: number) {
    await this.prisma.booking
      .delete({
        where: {
          id: bookingId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to delete booking', 400);
        }
      });
    return true;
  }
}
