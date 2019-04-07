Welcome to Team Maker's automated testing.

1.0 - Installation

To install the scripts for testing please put the /Scripts/ folder and all of it's contents into helium standalone directory. To run these successful tests execute the command:

playback("scripts\Successful Tests\main.he")

2.0 - User input

During the testing there are a few times when you the user will be prompted for a user input. This is either due to limitations of helium or set up being required before running the task in the case of deleting a team member.

The following tasks require user input, please read it carefully before proceeding with the tests:

Task 6:- Create a task
Task 6 tests that the system can create a task successfully. During this test there is a section to input the due date of the task. This has been done using the date input type in HTML. Unfortunately Helium doesn't at present have a method to input / select values using this input type. You the user will have to manually select a due date.

	The due date needs to be:
	- A valid date
	- In the future

Once you have done this click back onto the Helium testing window and press enter. The test will then continue to run.

Task 4:- Chat
Task 4 tests the chat system by sending message and checking that it has successfully shown in the chat log. Due to limitaions with Helium, the automatic test scripts are unable to select the chat button and therefore this action must be completed by the user when prompted by the system to do so.

Task 8:- Deleting a User
Task 8 tests that the system can delete a team member successfully. During this test we need you the user to join the team and then enter the name as it appears. The reasoning why this hasn't been automated is because we only have one test account created at this stage. This test will also allow you the user to test logging in with an account that isn't our test account and join a pre existing team.

	What you need to do:
	1. In a new Browser go to teammaker.com/beta/login
	2. Login using your google account
	3. Once you've logged in you will be taken to the team select page
	4. Enter heliumtesting into the team ID box and click join. The team ID is case sensitive all lowercase with no space.
	5. You should now see the team show up in the list as pending verification. Once you're at this stage please click back onto the Helium testing window and 		press enter. The test will then continue to run.
	6. You will be asked in the helium console to enter in the name as it's written in the team member list. So if it shows your name as "John Smith" then please 	enter John Smith and press Enter. The test will proceed as normal.
