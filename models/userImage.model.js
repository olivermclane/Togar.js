module.exports = (sequelize, Sequelize) => {
    const UserImage = sequelize.define('userImage', {
        image_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        extension: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image_size: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        width: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        height: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        login_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    })

    return UserImage;
}
