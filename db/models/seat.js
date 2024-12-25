import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Bus from "./bus.js";
import Trip from "./trip.js";

const Seat = sequelize.define(
  "Seat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    busId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Bus",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Seat number cannot be null",
        },
        notEmpty: {
          msg: "Seat number cannot be empty",
        },
      },
    },
    processingExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seatStatus: {
      type: DataTypes.ENUM("Available", "Processing", "Booked"),
      allowNull: false,
      defaultValue: "Available",
      validate: {
        notNull: {
          msg: "Seat status cannot be null",
        },
        notEmpty: {
          msg: "Seat status cannot be empty",
        },
        isIn: {
          args: [["Available", "Processing", "Booked"]],
          msg: "Seat status must be Available or Processing or Booked",
        },
      },
    },
  },
  {
    freezeTableName: true,
    modelName: "Seat",
  }
);

Bus.hasMany(Seat, { foreignKey: "busId", onDelete: "CASCADE" });
Seat.belongsTo(Bus, { foreignKey: "busId" });

export default Seat;
