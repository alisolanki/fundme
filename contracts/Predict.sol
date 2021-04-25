// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

contract Predict {
    Question[] public questions;
    uint8 public questionsCount;
    mapping(address => User) public userInfo;

    struct Answer {
        uint8 questionId;
        uint8 answerId;
        string answer;
        address[] usersAddress;
        uint32[] usersValue;
        uint32 volume;
    }

    struct Question {
        uint8 id;
        string questionTitle;
        Answer[] answers;
        uint32 totalVolume;
        uint32 totalUsers;
        bool prizeDistributed;
    }

    struct User {
        uint32 prizeAmount;
        Answer[] questionIdAnswer;
        uint32[] questionIdAmount;
    }

    constructor() {
        questionsCount = 0;
    }

    function addFundingBucket(string memory _title, string[] memory _answers)
        public
    {
        questions.push();
        questions[questionsCount].id = questionsCount;
        questions[questionsCount].questionTitle = _title;
        questions[questionsCount].totalVolume = 0;
        questions[questionsCount].totalUsers = 0;
        questions[questionsCount].prizeDistributed = false;

        address[] memory _null;
        uint32[] memory _nullValue;

        for (uint8 i = 0; i < _answers.length; i++) {
            questions[questionsCount].answers.push(
                Answer({
                    questionId: questionsCount,
                    answerId: i,
                    volume: 0,
                    answer: _answers[i],
                    usersValue: _nullValue,
                    usersAddress: _null
                })
            );
        }
        questionsCount++;
    }

    function selectProject(
        uint8 questionId,
        uint8 answerId,
        uint32 amount
    ) public returns (Answer memory) {
        questions[questionId].totalVolume =
            questions[questionId].totalVolume +
            amount;
        questions[questionId].totalUsers = questions[questionId].totalUsers + 1;

        questions[questionId].answers[answerId].usersValue.push(amount);
        questions[questionId].answers[answerId].usersAddress.push(msg.sender);
        questions[questionId].answers[answerId].volume =
            questions[questionId].answers[answerId].volume +
            amount;

        userInfo[msg.sender].questionIdAnswer[questionId] = questions[
            questionId
        ]
            .answers[answerId];
        userInfo[msg.sender].questionIdAmount[questionId] = amount;
        // userInfo[msg.sender].questionIdAnswer = questions[questionId].answers[
        //     answerId
        // ];
        // userInfo[msg.sender].questionIdAmount = amount;

        return (questions[questionId].answers[answerId]);
    }

    function distributePrizes(uint8 questionId) public {
        if (
            (questionId < questions.length) &&
            (questions[questionId].prizeDistributed != true)
        ) {
            Answer[] memory _answers = questions[questionId].answers;
            uint32 _questionTotalPrize =
                questions[questionId].totalVolume -
                    (questions[questionId].totalVolume / 10);
            for (uint8 i = 0; i < _answers.length; i++) {
                // uint256 _ansPrizePercent = calcPrize(_answers[i]);
                uint32 _ansPrizePercent = calcPrize(questionId, i);
                uint32 _answerBucket =
                    (_questionTotalPrize * _ansPrizePercent) / 100;

                for (uint8 j = 0; j < _answers[i].usersAddress.length; j++) {
                    if (_answers[i].volume != 0) {
                        User storage _user =
                            userInfo[_answers[i].usersAddress[j]];
                        uint32 _userPercent =
                            (_user.questionIdAmount[questionId] * 100) /
                                _answers[i].volume;
                        // uint32 _userPercent =
                        //     (_user.questionIdAmount * 100) / _answers[i].volume;
                        uint32 _userPrizeAmount =
                            (_answerBucket * _userPercent) / 100;

                        sendUserPrize({
                            userAddress: _answers[i].usersAddress[j],
                            prizeAmount: _userPrizeAmount
                        });
                    }
                }
            }
            questions[questionId].prizeDistributed = true;
        }
    }

    function getUserAddress() public view returns (address) {
        return msg.sender;
    }

    //Utility Functions
    function sendUserPrize(address userAddress, uint32 prizeAmount) private {
        userInfo[userAddress].prizeAmount =
            userInfo[userAddress].prizeAmount +
            prizeAmount;
    }

    function sqrt(uint32 x) private pure returns (uint32) {
        uint32 z = (x + 1) / 2;
        uint32 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    function calcValue(uint32[] memory candidateValue)
        private
        pure
        returns (uint32)
    {
        uint32 ans = 0;
        for (uint8 i = 0; i < candidateValue.length; i++) {
            ans = ans + sqrt(candidateValue[i]);
        }
        return ans * ans;
    }

    function calcPrize(uint8 questionId, uint8 answerId)
        private
        view
        returns (uint32)
    {
        // Question memory question = questions[answer.questionId];
        Question memory question = questions[questionId];
        Answer memory answer = questions[questionId].answers[answerId];
        Answer[] memory answerOptions = question.answers;
        uint32 totalCalcValue = 0;

        for (uint8 i = 0; i < answerOptions.length; i++) {
            Answer memory _ans = answerOptions[i];
            totalCalcValue = totalCalcValue + calcValue(_ans.usersValue);
        }

        if (totalCalcValue != 0) {
            return (calcValue(answer.usersValue) * 100) / totalCalcValue;
        }
        return 0;
    }
}
