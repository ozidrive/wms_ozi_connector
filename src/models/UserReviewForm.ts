import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface UserReviewFormAttributes {
  id?: number;
  name?: string;
  contact?: string;
  recommendationScore?: number;
  experience?: string;
  deliverySatisfaction?: number;
  customerSupportSatisfaction?: number;
  appExperienceSatisfaction?: number;
  productQualitySatisfaction?: number;
  created_at?: Date;
}

class UserReviewForm extends Model<UserReviewFormAttributes> implements UserReviewFormAttributes {
  public id!: number;
  public name?: string;
  public contact?: string;
  public recommendationScore?: number;
  public experience?: string;
  public deliverySatisfaction?: number;
  public customerSupportSatisfaction?: number;
  public appExperienceSatisfaction?: number;
  public productQualitySatisfaction?: number;
  public created_at?: Date;
}

UserReviewForm.init({
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
  recommendationScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliverySatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  customerSupportSatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  appExperienceSatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  productQualitySatisfaction: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'user_review_form',
  timestamps: false
});

export default UserReviewForm;

