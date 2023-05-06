//require models
const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');
const User = require('../models/User');
const axios = require('axios');
const Recipe = require('../models/Recipe');

//check logged in function
isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
//display all ingredients in a form sorted by freshness and allow add new ingredient
router.get('/pantry/',
  isLoggedIn,

  async (req, res, next) => {

    res.locals.ingredients =
      await Ingredient.find({ userId: req.user._id })
        .sort({ date: -1 })

    res.render('pantry');
  });

//Send request to add new ingredient
router.post('/pantry/addIngredient',
  isLoggedIn,
  async (req, res, next) => {
    const ingredient = new Ingredient(
      {
        name: req.body.name,
        amount: parseInt(req.body.amount),
        category: req.body.category,
        date: req.body.date,
        userId: req.user._id
      })
    await ingredient.save();
    res.redirect('/pantry')
  });

//Remove an ingredient 
//Remove
router.get('/pantry/remove/:ingredientId',
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /pantry/remove/:ingredientId")
    await Ingredient.deleteOne({ _id: req.params.ingredientId });
    res.redirect('/pantry')
  });

// create the obejct and pass by
createPrompt = async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.params.id);

  const prompts = `Please give me a recipe with ${ingredient.name}`;
  console.log(ingredient);

  const response =
    await axios.post('http://gracehopper.cs-i.brandeis.edu:3500/openai',
      { prompt: prompts })
  content = response.data.choices[0].message.content;
  console.log(ingredient);


  // assign the content
  const responseOb = new Recipe({
    prompt: prompts,
    answer: response.data.choices[0].message.content,
    createId: response.data.created
  });

  res.locals.content = response.data.choices[0].message.content;
  res.locals.resId = response.data.created;

  await responseOb.save();
  next();
}

router.get('/pantry/cook/:id', isLoggedIn, createPrompt,
  async (req, res) => {
    try {
      const user = res.locals.user;
      const resObject = await Recipe.find({ createId: res.locals.resId });
      await User.findByIdAndUpdate(user._id, {
        $push: { questions: resObject },
      });

      res.render('recipeList', { Recipes: resObject });
    } catch (error) {
      console.error(error);
    }

  });

router.get('/pantry/recipe', isLoggedIn,
  async (req, res) => {
    try {
      const user = res.locals.user;
      const populatedUser = await User.findById(user._id).populate('questions');
      const resObject = populatedUser.questions;

      res.render('recipeList', { Recipes: resObject });
    } catch (error) {
      console.error(error);
    }
  });

module.exports = router;

