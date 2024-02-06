#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
var qrcode = require('qrcode-terminal');

clear();

const prompt = inquirer.createPromptModule();

const openUrl = (url) => {
    open(url).catch(() => {
        console.log(`\n\nCould not open the URL in the default browser. Please open the following link manually:\n${url}\n`);
    });
};

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open("mailto:kuwarx1@gmail.com");
                    console.log("\n  Done, see you soon at inbox.\n");
                    handleUserAction(); // Continue after completing the action
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    const loader = ora({
                        text: ' Downloading Resume',
                        spinner: cliSpinners.material,
                    }).start();

                    try {
                        let pipe = request('https://kuwar-resume.vercel.app/').pipe(fs.createWriteStream('./kuwar-resume.html'));
                        pipe.on("finish", function () {
                            let downloadPath = path.join(process.cwd(), 'kuwar-resume.html');
                            console.log(`\nResume Downloaded at ${downloadPath} \n`);
                            try {
                                open(downloadPath).then(() => {
                                    loader.stop();
                                    setTimeout(() => {
                                        qrcode.generate('https://kuwar-resume.vercel.app/', { small: true }, function (qrcode) {
                                            console.log(qrcode, chalk.blue("\nScan this QR code") + chalk.white(" if you prefer viewing the resume on your ") + chalk.blue("smartphone") + chalk.white(" or if you've ") + chalk.red("encountered any issues\n\n"));
                                            handleUserAction(); // Continue after completing the action
                                        });
                                    }, 500);
                                }).catch(() => {
                                    console.error("Error opening browser. Please open the resume manually: https://kuwar-resume.vercel.app/ \n");
                                    loader.stop();
                                });
                            } catch (error) {
                                console.error("Error opening browser. Please open the resume manually: https://kuwar-resume.vercel.app/ \n", error);
                                loader.stop();
                            }
                        });

                        pipe.on("error", function (error) {
                            console.error("Error opening browser. Please open manually: https://kuwar-resume.vercel.app/ \n", error.message);
                            loader.stop();
                        });
                    } catch (error) {
                        console.error(" Error opening browser. Please open manually: https://kuwar-resume.vercel.app/ \n");
                        loader.stop();
                    }
                }
            },
            {
                name: `Schedule a ${chalk.redBright.bold("Meeting")}?`,
                value: () => {
                    const url = 'https://calendly.com/kuwarx1/30min';

                    const loader = ora({
                        text: ' Opening Calendar...',
                        spinner: cliSpinners.material,
                    }).start();

                    try {
                        openUrl(url);

                        loader.stop();
                        setTimeout(() => {
                            qrcode.generate('https://calendly.com/kuwarx1/30min', { small: true }, function (qrcode) {
                                console.log(qrcode, chalk.white("\nSimply ") + chalk.blue("scan this QR code") + chalk.white(" to schedule the meeting on your ") + chalk.blue("smartphone") + chalk.white(" or if you've ") + chalk.red("encountered any issues\n\n"));
                                handleUserAction(); // Continue after completing the action
                            });
                        }, 500);
                    } catch (error) {
                        console.error(`Error opening Calendly. Please open manually: https://calendly.com/kuwarx1/30min \n`);
                        loader.stop();
                    }
                }
            },
            {
                name: "Just quit. \n",
                value: () => {
                    console.log(chalk.green("  Thank you for your time!!\n"));
                }
            }
        ]
    }
];

function handleUserAction() {
    prompt(questions).then((answer) => {
        // Execute the selected action
        answer.action();
    });
}

function displayUserInfo() {
    const data = {
        name: chalk.bold.green("                     Kuwar Singh"),
        handle: chalk.white(""),
        title: `${chalk
            .hex("#2b82b2")
            .bold("Software Development Engineer        ")}`,
        github: chalk.gray("https://github.com/") + chalk.green("Kuwar20"),
        linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("kuwar-singh"),
        email: chalk.gray("kuwarx1@gmail.com"),
        web: chalk.cyan("Working on portfolio website."),
        npx: chalk.red("npx") + " " + chalk.white("kuwar"),

        labelWork: chalk.white.bold("      Title:"),
        labelGitHub: chalk.white.bold("     GitHub:"),
        labelLinkedIn: chalk.white.bold("   LinkedIn:"),
        labelEmail: chalk.white.bold("      Email:"),
        labelWeb: chalk.white.bold("        Web:"),
        labelCard: chalk.white.bold("       Card:")
    };

    const me = boxen(
        [
            `${data.name}`,
            ``,
            `${data.labelWork}  ${data.title}`,
            ``,
            `${data.labelGitHub}  ${data.github}`,
            `${data.labelLinkedIn}  ${data.linkedin}`,
            `${data.labelEmail}  ${data.email}`,
            `${data.labelWeb}  ${data.web}`,
            ``,
            `${data.labelCard}  ${data.npx}`,
            ``,
            `${chalk.italic(
                "     I am currently looking for new opportunities,"
            )}`,
            `${chalk.italic("     my inbox is always open. Whether you have a")}`,
            `${chalk.italic(
                "     question or just want to say hi, I will try "
            )}`,
            `${chalk.italic(
                "     my best to get back to you!"
            )}`
        ].join("\n"),
        {
            margin: 1,
            float: 'center',
            padding: 1,
            borderStyle: "single",
            borderColor: "green"
        }
    );

    console.log(me);
    const tip = [
        `Tip: Easily ${chalk.cyanBright.bold("open the links")} above in your browser by ${chalk.cyanBright.bold(
            "cmd/ctrl + clicking"
        )} on them.`,
        '',
    ].join("\n");
    console.log(tip);

    // Start the user interaction after displaying user information
    handleUserAction();
}

// Display user information
displayUserInfo();