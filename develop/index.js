const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const pdf = require("html-pdf")
const generateHTML = require("./develop/generateHTML.js").generateHTML;

function promptUser() {
    inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "May I have your username?"
        },
        {
            type: "list",
            name: "color",
            message: "Please pick your profile background color choice.",
            choices: [
                "green",
                "blue",
                "pink",
                "red"
            ]
        }]).then(function ({ username, color }) {
            console.log(color)
            const queryURL = 'https://api.github.com/users/${username}';
            axios.get(queryURL).then(function (response) {
                const user = response.data

                var data = {
                    profileImg: user.avatar_url,
                    actualName: user.name,
                    company: user.company,
                    username: user.login,
                    location: user.location,
                    github: user.html_url,
                    blog: user.blog,
                    bio: user.bio,
                    publicRepos: user.public_repos,
                    follower: user.followers,
                    stars: user.public_gists,
                    following: user.following,
                    color: color
                }
                var populate = generateHTML(data)
                createPDF(data.username, populate);
            });
        });
}

function createPDF(user, data) {
    const fileName = user + ".pdf";
    var options = { format: 'Letter' };
    pdf.create(data, options).toFile(fileName, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("Success")
    });
}

function init() {
    try {

        promptUser();

    } catch (err) {

        console.log(err)
    }

}

init();
