from .mongo_manager import db

class Service(object):
    """A :class:`Service` instance encapsulates common MongoEngine model
    operations in the context of a :class:`Flask` application.
    """
    __model__ = None
    __collection__ = None
    __database__ = 'zenon'


    def find(self, **kwargs):
        """Returns a list of instances of the service's model filtered by the
        specified key word arguments.
        :param **kwargs: filter parameters
        """
        variable = self.__model__(**kwargs)
        return db.cx[self.__database__][str(self.__collection__)].find(variable.to_mongo())

    def find_one(self, **kwargs):
        """Returns one of instances of the service's model filtered by the
        specified key word arguments.
        :param **kwargs: filter parameters
        """
        variable = self.__model__(**kwargs)
        return db.cx[self.__database__][str(self.__collection__)].find_one(variable.to_mongo())

    def first(self, **kwargs):
        """Returns the first instance found of the service's model filtered by
        the specified key word arguments.
        :param **kwargs: filter parameters
        """
        return self.find_one(kwargs)


    def count(self, **kwargs):
        """Returns a new, saved instance of the service's model class.
        :param **kwargs: instance parameters
        """
        variable = self.__model__(**kwargs)
        return db.cx[self.__database__][str(self.__collection__)].count(variable.to_mongo())


    def update_one(self, filter, update):
        """Returns an updated instance of the service's model class.
        :param model: the model to update
        :param **kwargs: update parameters
        """

        return db.cx[self.__database__][str(self.__collection__)].update_one(filter, update)

    def update_many(self, filter, update):
        pass


    def replace_one(self, filter, **kwargs):
        """Returns an updated instance of the service's model class.
        :param model: the model to update
        :param **kwargs: update parameters
        """
        variable = self.__model__(**kwargs)
        return db.cx[self.__database__][str(self.__collection__)].replace_one(filter, variable.to_mongo())

    def replace_many(self, object, value):
        pass


    def delete_one(self, filter):
        """Returns an updated instance of the service's model class.
        :param model: the model to update
        :param **kwargs: update parameters
        """

        return db.cx[self.__database__][str(self.__collection__)].delete_one(filter)

    def delete_many(self, filter):
        pass


    def insert_one(self, **kwargs):
        variable = self.__model__(**kwargs)
        return db.cx[self.__database__][str(self.__collection__)].insert_one(variable.to_mongo())

    def insert_many(self, documents):
        pass

    # def get_or_404(self, id):
    #     """Returns an instance of the service's model with the specified id or
    #     raises an 404 error if an instance with the specified id does not exist.
    #     :param id: the instance id
    #     """
    #     return self.__model__.objects.get_or_404(id=id)

    # def new(self, **kwargs):
    #     """Returns a new, unsaved instance of the service's model class.
    #     :param **kwargs: instance parameters
    #     """
    #     return self.__model__(**self._preprocess_params(kwargs))

    # def create(self, **kwargs):
    #     """Returns a new, saved instance of the service's model class.
    #     :param **kwargs: instance parameters
    #     """
    #     return self.save(self.new(**kwargs))

    # def update(self, model, **kwargs):
    #     """Returns an updated instance of the service's model class.
    #     :param model: the model to update
    #     :param **kwargs: update parameters
    #     """
    #     self._isinstance(model)
    #     for k, v in self._preprocess_params(kwargs).items():
    #         setattr(model, k, v)
    #     self.save(model)
    #     return model

    # def delete(self, model):
    #     """Immediately deletes the specified model instance.
    #     :param model: the model instance to delete
    #     """
    #     self._isinstance(model)
    #     model.delete()

    # def _isinstance(self, model, raise_error=True):
    #     """Checks if the specified model instance matches the service's model.
    #     By default this method will raise a `ValueError` if the model is not the
    #     expected type.
    #     :param model: the model instance to check
    #     :param raise_error: flag to raise an error on a mismatch
    #     """
    #     rv = isinstance(model, self.__model__)
    #     if not rv and raise_error:
    #         raise ValueError('%s is not of type %s' % (model, self.__model__))
    #     return rv

    # def _preprocess_params(self, kwargs):
    #     """Returns a preprocessed dictionary of parameters. Used by default
    #     before creating a new instance or updating an existing instance.
    #     :param kwargs: a dictionary of parameters
    #     """
    #     kwargs.pop('csrf_token', None)
    #     return kwargs


    # def save(self, model):
    #     """Commits the model to the database and returns the model
    #     :param model: the model to save
    #     """
    #     self._isinstance(model)
    #     model.save()
    #
    #     return model

    # def all(self):
    #     """Returns a generator containing all instances of the service's model.
    #     """
    #     return self.__model__.objects

    # def get(self, id):
    #     """Returns an instance of the service's model with the specified id.
    #     Returns `None` if an instance with the specified id does not exist.
    #     :param id: the instance id
    #     """
    #     return self.__model__.objects(id=id)

    # def get_all(self, *ids):
    #     """Returns a list of instances of the service's model with the specified
    #     ids.
    #     :param *ids: instance ids
    #     """
    #     objs = None
    #     for id in ids:
    #         objs.append(self.__model__.objects(id=id))
    #     return objs
    # TRY: self.__model__.objects(id__all=ids)
