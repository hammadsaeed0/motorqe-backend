
// const express = require('express');
import express from "express";
const router = express.Router();


import {RequestPackage,getAllPackageRequests,getPackageReqById,updatePackageRequest} from
'../controller/planeController.js'


router.post('/package-request',RequestPackage)
router.get("/admin/package-requests",getAllPackageRequests )
router.get("/admin/package-requestsById/:id",getPackageReqById )
router.put("/admin/package-requests-aproval/:id",updatePackageRequest)



export default router;