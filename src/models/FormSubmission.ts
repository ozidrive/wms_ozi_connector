import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface FormSubmissionAttributes {
  id?: number;
  name?: string;
  contact?: string;
  location?: any;
  preferredDate?: Date;
  address?: string;
  preferredTime?: string;
  items?: any;
  quantity?: string;
  created_at?: Date;
}

class FormSubmission extends Model<FormSubmissionAttributes> implements FormSubmissionAttributes {
  public id!: number;
  public name?: string;
  public contact?: string;
  public location?: any;
  public preferredDate?: Date;
  public address?: string;
  public preferredTime?: string;
  public items?: any;
  public quantity?: string;
  public created_at?: Date;
}

FormSubmission.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true
  },
  preferredDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  preferredTime: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true
  },
  quantity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'form_submissions',
  timestamps: false // Since we have created_at as a column, not using Sequelize timestamps
});

export default FormSubmission;