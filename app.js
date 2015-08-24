Articles = new Mongo.Collection('articles');

Router.route('/', {
    name: 'page1',
    waitOn: function() {
        return this.subscribe('article', 'article1');
    }
});

Router.route('/page2', {
    name: 'page2',
    waitOn: function() {
        return this.subscribe('article', 'article2');
    }
});

if (Meteor.isClient) {
    RelatedArticles = new Mongo.Collection('relatedArticles');

    Template.articles.helpers({
        articles: function () {
            return Articles.find();
        },
        relatedArticles: function() {
            return RelatedArticles.find();
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        if (Articles.find().count() <= 0) {
            Articles.insert({
                _id: 'article1',
                title: 'Article 1'
            });
            Articles.insert({
                _id: 'article1.1',
                title: 'Article 1.1',
                relatedTo: 'article1'
            });
            Articles.insert({
                _id: 'article1.2',
                title: 'Article 1.2',
                relatedTo: 'article1'
            });

            Articles.insert({
                _id: 'article2',
                title: 'Article 2'
            });
            Articles.insert({
                _id: 'article2.1',
                title: 'Article 2.1',
                relatedTo: 'article2'
            });
            Articles.insert({
                _id: 'article2.2',
                title: 'Article 2.2',
                relatedTo: 'article2'
            });
        }
    });

    Meteor.publishComposite('article', function(articleId) {
        return {
            find: function() {
                return Articles.find({ _id: articleId });
            },
            children: [
                {
                    collectionName: 'relatedArticles',

                    find: function(article) {
                        return Articles.find({ relatedTo: article._id });
                    }
                }
            ]
        };
    });
}
