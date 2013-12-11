var socket = $.WebSocket(options);

var loginListener = $('#poker-login-form').login({
    overlay: '.poker-overlay',
    userInfoClass: '.poker-userinfo',
    nameClass: '.poker-userinfo-name',
    roleClass: '.poker-userinfo-role',
    loaderBackgroundClass: options.loaderBackgroundClass,
    lsUserKey: options.lsUserKey,
    availableRoles: options.availableRoles,
    roleSettings: {
        developer: {
            hide: ['.scrum-master', '.scrum-product-owner'],
            show: []
        },
        scrumMaster: {
            hide: ['.scrum-developer', '.scrum-product-owner'],
            show: ['.scrum-master']
        },
        productOwner: {
            hide: ['.scrum-developer', '.scrum-master'],
            show: ['.scrum-product-owner']
        },
        spectator: {
            hide: ['.scrum-developer', '.scrum-master', '.scrum-product-owner'],
            show: []
        }
    }
});

$('.poker-logout').logout({
    lsUserKey: options.lsUserKey
});

$('.poker-cards').cardselection({
    lsUserKey: options.lsUserKey,
    selectedClass: 'poker-card-selected',
    pokerCardBackClass: '.poker-card-back'
});

var chatListener = $('.poker-chat').chat();

var scrumMasterListener = $('.scrum-master').scrumMaster({
    pokerCardsShowButton: '#poker-cards-show-button',
    pokerCardsResetButton: '#poker-cards-reset-button',
    pokerRoomResetButton: '#poker-room-reset',
    showCardsSelectorClass: 'poker-card-display',
    showCardsToggleClass: 'poker-card-display-hidden',
    userstory: '.poker-userstory',
    'i18n': i18n
});

$('.scrum-product-owner').productOwner({
    postUserStoryTextarea: '#poker-userstory-textarea',
    postUserStoryButton: '#poker-userstory-post',
    editUserStoryButton: '#poker-userstory-edit-button',
    userStoryText: '#poker-userstory-text'
});

var userlistListener = $('.poker-users-online').userlist({
    availableRoles: options.availableRoles
});

var userstoryListener = $('.poker-userstory').userstory({
    userstoryText: '#poker-userstory-text',
    editUserStoryButton: '#poker-userstory-edit-button',
});

var carddisplayListener = $('.poker-felt').carddisplay({
    pokerCardsShowButton: '#poker-cards-show-button',
    pokerCardSelectedClass: 'poker-card-selected',
});

$(window).on('load', function() {
    $('.poker-login-user input[type="text"]').focus();
});

var socketOptions = options;
socketOptions.elements = {
    notification: '#poker-notification',
    loaderBackgroundClass: options.loaderBackgroundClass,
};
socketOptions.listeners = [
    loginListener,
    scrumMasterListener,
    chatListener,
    userlistListener,
    userstoryListener,
    carddisplayListener
];
socket.setOptions(socketOptions);