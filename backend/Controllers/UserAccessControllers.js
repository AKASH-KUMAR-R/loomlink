
const mongoose = require('mongoose');
const UserModel = require('../Model/UserModel');
const express = require('express');


const createUser = async (req, res) => {

    const {username, password} = req.body;

    if (username && password) {

        const userExist = await UserModel.findOne({user_name: username});
        if (userExist) {
            return res.status(409).json({error: "User already exist", message: "The user with the specified username already exists."});
        }
        
        const userDetails = await UserModel.create({user_name: username, password: password});

        if (userDetails) 
            res.status(200).json({message: "User created successfully", status:true});
        else    
            res.status(500).json({message:"User not created", status:false});

    } else {
        res.status(500).json({message: "Required fields not found"});
    }

};

const userExist = async (req, res) => {

    try {
        const {username, password} = req.body;

        if (username  && password) {

            const userDetails = await UserModel.find({user_name: username, password: password});
            
            if (userDetails.length > 0) {
                res.status(200).json({message: "User founded", status: true, user_key: userDetails[0]._id});
            } else {
                res.status(404).json({message: "User not found", status: false});
            }

        } else {
            res.status(404).json({message: "Required fields not found"});
        }
    } catch(err) {
        console.log(err.message);
        res.status(500).json({message:"Server side error"});
    }
    
}
module.exports = {
    createUser,
    userExist,
};