Backbone.Model.prototype.idAttribute = '_id';

//person model
var Person = Backbone.Model.extend({
    defaults: {
        name: 'Guest User',
        age: 30,
        occupation: 'worker',
        gender: 'undefined'
    },
    validate: function (attr) {
        if (isNaN(attr.age) || (attr.age < 0 || attr.age > 120 )) {
            alert("Age must be between 1 and 120 years");
            return "Invalid age";
        }
    }
});

var People = Backbone.Collection.extend({
    url: 'http://localhost:16667/api/person'
});

// instantiate sample group of people
var person1 = new Person({
    name: 'Mohit Jain',
    age: 26,
});
var person2 = new Person({
    name: 'Taroon Tyagi',
    age: 25,
    occupation: 'web designer'
});
var person3 = new Person({
    name: 'Rahul Narang',
    age: 26,
    occupation: 'Java Developer'
});

// instantiate a Collection
var people = new People();
//BB view for one person
var PersonView = Backbone.View.extend({
    model: new Person(),
    tagName: 'li',

    initialize: function () {
        this.template = _.template($('.personTemplate').html());
    },
    events: {
        'click .edit': 'editPerson',
        'click .update': 'updatePerson',
        'click .delete': 'delete'
    },

    editPerson: function () {

        $('.edit').hide();
        $('.delete').hide();
        this.$('.update').show();

        var editedName = this.$('.personName').html();
        var editedAge = this.$('.personAge').html();
        var editedOccupation = this.$('.personOccupation').html();
        var editedGender = this.$('.personGender').html();

        this.$('.personName').html('<input type="text" class="name-edit" value="' + editedName + '">');
        this.$('.personAge').html('<input type="text" class="age-edit" value="' + editedAge + '">');
        this.$('.personOccupation').html('<input type="text" class="occupation-edit" value="' + editedOccupation + '">');
        this.$('.personGender').html('<input type="text" class="gender-edit" value="' + editedGender + '">');

        $(document).ready(function () {
            $('input:text').focus(
                function () {
                    $(this).css({'background-color': '#FFAAAA'});
                });
            $('input:text').blur(
                function () {
                    $(this).css({'background-color': '#FFFFFF'});
                });
        });
    },

    updatePerson: function () {
        this.model.set('name', $('.name-edit').val());

        this.model.set('age', $('.age-edit').val(), {validate: true});

        this.model.set('occupation', $('.occupation-edit').val());
        this.model.set('gender', $('.gender-edit').val());

        this.model.save(null, {
            success: function (response) {
                console.log('Successfully UPDATED person with id: ' + response.toJSON()._id);
            },
            error: function () {
                console.log('Failed to update persons');
            }
        });
    },

    delete: function () {
        this.model.destroy({
            success: function(res) {
                console.log('Successfully DELETED person with _id: ' + res.toJSON()._id)
            },
            error: function() {
                console.log('Failed to delete persons');
            }
        });
    },

    remove: function () {
        this.$el.remove();
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

//BB view for all people
var PeopleView = Backbone.View.extend({
    model: people,
    el: $('.people-list'),

    initialize: function () {
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change',
            function () {
                setTimeout(function () {
                    self.render();
                }, 50)
            }, this);
        this.model.on('remove', this.render, this);
        this.model.fetch({
            success: function (response) {
                _.each(response.toJSON()
                    , function (item) {
                        console.log(
                            'Successfully GOT person with id: '
                            + item._id);
                    });
            },
            error: function () {
                console.log('Failed to GET person with id: '
                    + item._id);
            }
        });
    },

    render: function () {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function (person) {
            self.$el.append((new PersonView({model: person})).render().$el);
        }); // each
        return this;
    } // render function
}); // people view

var peopleView = new PeopleView();

$(document).ready(function () {
    $('input:text').focus(
        function () {
            $(this).css({'background-color': '#FFAAAA'});
        });
    $('input:text').blur(
        function () {
            $(this).css({'background-color': '#FFFFFF'});
        });
    console.log("document loaded");
    // $('.people-list').show(people.fetch());

    $('.add-person').on('click', function () {
        var newPerson = new Person();
        if ($('.name-input').val()) {
            newPerson.set('name', $('.name-input').val());
        }
        if ($('.age-input').val()) {
            newPerson.set('age', $('.age-input').val());
        }
        if ($('.occupation-input').val()) {
            newPerson.set('occupation', $('.occupation-input').val());
        }
        if ($('.gender-input').val()) {
            newPerson.set('gender', $('.gender-input').val());
        }

        $('.name-input').val('');
        $('.age-input').val('');
        $('.occupation-input').val('');
        $('.gender-input').val('');

        people.add(newPerson);

        newPerson.save(null, {
            success: function(res){
                console.log('Successfully SAVED person with id: ' + res.toJSON()._id);
            },
            error: function(res){
                console.log('Failed to save person with id: ' + res.toJSON()._id);
            }
        });
    });
    //
    // people.add(person1);
    // people.add(person2);
    // people.add(person3);
});




