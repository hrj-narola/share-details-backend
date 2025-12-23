const express = require('express');
const { getInquiries, creatInquiry, updateInquiry } = require('../controller/inquiries.controller');
const { MESSAGES, STATUS_CODE } = require('../utils/constants');
const { createInquiryStatus, getAllInquiryStatus, deleteInquiryStatus } = require('../controller/inquirystatus.controller');
const router = express.Router();

//TO CREATE NEW INQUIRY
router.post("/", async function (req, res, next) {
  try {
    const newInquiry = await creatInquiry(req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: newInquiry });
  } catch (error) {
    next(error);
  }
})

//TO GET THE LIST OF INQUIRIES 
router.get("/", async function (req, res, next) {
  try {
    const inquiries = await getInquiries();
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: inquiries });
  } catch (error) {
    next(error)
  }
})

router.patch("/", async function (req, res, next) {
  try {
    const newInquiry = await updateInquiry(req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: newInquiry });
  } catch (error) {
    next(error);
  }
})

// TO CREATE INQUIRY STATUS
router.post("/status", async function (req, res, next) {
  try {
    const newInquiry = await createInquiryStatus(req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: newInquiry });
  } catch (error) {
    next(error);
  }
})

// TO GET THE LIST OF STATUS
router.get("/status", async function (req, res, next) {
  try {
    const newInquiry = await getAllInquiryStatus();
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: newInquiry });
  } catch (error) {
    next(error);
  }
})

// TO DELETE THE STATUS
router.delete("/status", async function (req, res, next) {
  try {
    const newInquiry = await deleteInquiryStatus(req.body);
    res.status(STATUS_CODE.OK).json({ msg: MESSAGES.SUCCESS, data: newInquiry });
  } catch (error) {
    next(error);
  }
})

module.exports = router;