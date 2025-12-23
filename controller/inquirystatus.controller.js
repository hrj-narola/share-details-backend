const createHttpError = require("http-errors")
const InquiryStatus = require("../models/inquiryStatus")
const { STATUS_CODE, MESSAGES } = require("../utils/constants")

exports.getAllInquiryStatus = async () => {
  const inquiryStatusList = await InquiryStatus.find()
  if (!inquiryStatusList.length) {
    throw new createHttpError(STATUS_CODE.NOT_FOUND, MESSAGES.NOT_FOUND)
  }
  return inquiryStatusList
}

exports.createInquiryStatus = async (data) => {
  if (!data.name) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, "Name is required")
  }
  const name = data.name
  const slug = data.name.toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
  const isAlreadySlugCreated = await InquiryStatus.findOne({ slug })
  if (isAlreadySlugCreated) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, MESSAGES.STATUS_ALREADY_CREATED)
  }
  const newInquiryStatus = await InquiryStatus.create({
    name, slug
  });
  return newInquiryStatus;

}

exports.deleteInquiryStatus = async (data) => {
  if (!data.id) {
    throw new createHttpError(STATUS_CODE.BAD_REQUEST, "Id is required")
  }
  await InquiryStatus.deleteOne({ _id: data.id })
  return { message: "Inquiry Status deleted successfully" }
}
