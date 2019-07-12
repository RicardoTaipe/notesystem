const express = require('express');
const router = express.Router();
const Note = require('../models/note');

const {isAuthenticated} = require('../helpers/auth');

//render hmtl to add a note
router.get('/add', isAuthenticated,(req,res)=>{
    res.render('notes/new-note');
});

//handle note received from a form in new note view
router.post('/new-note',isAuthenticated,async (req,res)=>{
    const {title,description}= req.body;
    const errors =[];
    if(!title){
        errors.push({msg:'Please enter a title'});
    }
    if(!description){
        errors.push({msg:'Please enter a description'});
    }
    if(errors.length>0){
        res.render('notes/new-note',{
            errors,
            title,
            description
        });
    }else{
         const newNote =new Note({title,description});
         newNote.user = req.user.id;
         await newNote.save(); 
         req.flash('success_msg','Note added successfully');                
         res.redirect('/notes');
    }        
});

//render all note in html
router.get('/',isAuthenticated,async (req,res)=>{
    const notes = await Note.find({user:req.user.id}).sort({date:'desc'});
    res.render('notes/all-notes',{
        notes
    });    
});

//render note to be edited -- html
router.get('/edit/:id',isAuthenticated,async (req,res)=>{    
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note',{
        note
    });    
});

//update a note in db
router.put('/edit-note/:id',isAuthenticated,async (req,res)=>{    
    const {title,description} = req.body;
    await Note.findByIdAndUpdate(req.params.id,{title,description});
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');    
});

//delete a note in db

router.delete('/delete/:id',isAuthenticated, async (req,res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});

module.exports = router;