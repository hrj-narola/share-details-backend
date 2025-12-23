const createHttpError = require("http-errors");
const Inquiries = require("../models/inquiries");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");
const User = require("../models/users");
const InquiryStatus = require("../models/inquiryStatus");

exports.getInquiries = async () => {
  let inquires;
  inquires = await Inquiries.find({}).populate([{
    path: 'productId',
    populate: ['categoryId'],
    select: "name price stock"
  },
  {
    path: 'userId',
    select: 'name email'
  },
  {
    path: 'status',
    select: 'name'
  },

  ]);
  if (!inquires.length) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.INQUIRIES_NOT_FOUND);
  }
  return inquires;
};

exports.creatInquiry = async (data) => {
  if (Object.keys(data).length === 0) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.DELETE_CATEGORY_ERROR)
  }

  const user = await User.findOne({ email: data.email })
  const inquiryStatus = await InquiryStatus.findOne()
  if (user) {
    const newInquiry = await Inquiries.create({
      userId: user._id,
      number: data.number,
      productId: data.productId,
      quantity: data.quantity,
      size: data.size,
      customerGroup: data.customerGroup,
      designRequirements: data.designRequirements,
      status: inquiryStatus._id
    });
    return newInquiry;
  }
  else {
    const newUser = await User.create({
      email: data.email,
      isDisabled: true,
      name: data.name,
    });


    const newInquiry = await Inquiries.create({
      userId: newUser._id,
      number: data.number,
      productId: data.productId,
      quantity: data.quantity,
      size: data.size,
      customerGroup: data.customerGroup,
      customerGroups: data.customerGroup,
      designRequirements: data.designRequirements,
      status: inquiryStatus._id
    });
    return newInquiry;
  }
};

exports.updateInquiry = async (data) => {
  if (Object.keys(data).length === 0) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.DELETE_CATEGORY_ERROR)
  }
  const id = data.id
  const inquiry = await Inquiries.findById(id)
  if (!inquiry) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.INQUIRIES_NOT_FOUND)
  }
  inquiry.status = data.status;
  inquiry.note = data.note;
  await inquiry.save()
};


