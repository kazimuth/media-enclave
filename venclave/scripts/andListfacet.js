/**
 * Create intersection of all those elements in the database that contain all requested
 * values; the counterpart of Exhibit.Database._Impl.prototype._getUnion.
 *
 * @param {Object} index, the spo/ops object containing all data.
 * @param {set} xSet, the subjects/objects that all items should contain.
 * @param {String} y, the property to which the intersection is applied.
 * @param {set} set, the return set.
 * @param {set} filter, an optional set used as filter.
 * @returns set
 */
Exhibit.Database._Impl.prototype._getIntersection = function(index, xSet, y, set, filter) {
    if (!set) {
        set = new Exhibit.Set();
    }

    var database = this;
    xSet.visit(function(x) {
        var ySet = new Exhibit.Set();
        database._indexFillSet(index, x, y, ySet, filter);
        filter = ySet;
    });
    if (filter !== null) {
        set = filter;
    }
    return set;
};

/**
 * Get those objects that contain all values in set "subjects" for property "p";
 * counterpart of Exhibit.Database._Impl.prototytpe.getObjectsUnion.
 *
 * @param {set} subjects, set of subjects.
 * @param {String} p, the property.
 * @param {set} set, ...
 * @param {set} filter, .
 * @returns set
 */
Exhibit.Database._Impl.prototype.getObjectsIntersection = function(subjects, p, set, filter) {
    return this._getIntersection(this._spo, subjects, p, set, filter);
};

/**
 * Get those subjects that contain all values in set "objects" for property "p";
 * counterpart of Exhibit.Database._Impl.prototype.getSubjectsUnion.
 *
 * @param {set} objects, set of objects.
 * @param {String} p, the property.
 * @param {set} set,
 * @param {set} filter,
 * @returns set
 */
Exhibit.Database._Impl.prototype.getSubjectsIntersection = function(objects, p, set, filter) {
    return this._getIntersection(this._ops, objects, p, set, filter);
};

/**
 * Get all those items for which the expression evaluation contains all values in parameter 'values'; counterpart of Exhibit.FacetUtilities.Cache.prototype.getItemsFromValues.
 *
 * @param {set} values, calculated expression result must contain all these values.
 * @param {set} filter, the returned items must be a member of this set.
 * @returns set
 */
Exhibit.FacetUtilities.Cache.prototype.getItemsContainingAllValues = function(values, filter) {
    var set;
    if (this._expression.isPath()) {
        set = this._expression.getPath().intersectionWalk(
            values,
            "item",
            filter,
            this._database
        ).getSet();
    } else {
        alert('expresion is not a path is not tested yet');
        this._buildMaps();

        set = new Exhibit.Set(filter);

        var valueToItem = this._valueToItem;
        values.visit(function(value) {
            if (value in valueToItem) {
                var newSet = new Exhibit.Set();
                var itemA = valueToItem[value];
                for (var i=0; i < itemA.length; i++) {
                    var item = itemA[i];
                    if (set.contains(item)) {
                        newSet.add(item);
                    }
                }
                set = new Exhibit.Set(newSet);
            } else {
                return new Exhibit.Set();
            }
        });
    }
    return set;
};

/**
 * Get ...; counterpart of Exhibit.Path.prototype.walkBackward.
 *
 * @param {set} values,
 * @param {String} valueType,
 * @param {set} filter,
 * @param {..} database,
 * @returns set
 */
Exhibit.Expression.Path.prototype.intersectionWalk = function(
    values,
    valueType,
    filter,
    database
) {
    return this._intersectionWalk(new Exhibit.Expression._Collection(values, valueType), filter, database);
};

/**
 * Get those items for which expression calculates to a value set that contains all values in 'collection' ; counterpart of Exhibit.Path.prototype._walkBackward.
 *
 * @param {collection} collection, the values of which must all be contained in the expression result.
 * @param {set} filter, the return values must be part of this set.
 * @param {..} database,
 * @returns collection
 */
Exhibit.Expression.Path.prototype._intersectionWalk = function(collection, filter, database) {
    var values;
    var property;
    var valueType;
    for (var i = this._segments.length - 1; i >= 0; i--) {
        var segment = this._segments[i];
        if (segment.isArray) {
            alert('segment isArray has not been tested yet.');
            var a;
            var pruneFilter;
            if (segment.forward) {
                if (i == this._segments.length - 1) {
                    collection.forEachValue(function(v) {
                        a = [];
                        database.getSubjects(v, segment.property).visit(function(v2) {
                            if (pruneFilter === undefined|| pruneFilter.contains(v2)) {
                                if (i === 0 && filter !== null) {
                                    if (filter.contains(v2)) { a.push(v2); }
                                } else {
                                    a.push(v2);
                                }
                            }
                        });
                        pruneFilter = new Exhibit.Set(a);
                    });
                } else {
                    collection.forEachValue(function(v) {
                        database.getSubjects(v, segment.property).visit(function(v2) {
                            if (i > 0 || filter === null || filter.contains(v2)) {
                                a.push(v2);
                            }
                        });
                    });
                }
                property = database.getProperty(segment.property);
                valueType = property !== null ? property.getValueType() : "text";
            } else {
                if (i === this._segments.length - 1) {
                    collection.forEachValue(function(v) {
                        a = [];
                        database.getObjects(v, segment.property).visit(function(v2) {
                            if (pruneFilter === undefined|| pruneFilter.contains(v2)) {
                                if (i === 0 && filter !== null) {
                                    if (filter.contains(v2)) { a.push(v2); }
                                } else {
                                    a.push(v2);
                                }
                            }
                        });
                        pruneFilter = new Exhibit.Set(a);
                    });
                } else {
                    collection.forEachValue(function(v) {
                        database.getObjects(v, segment.property).visit(function(v2) {
                            if (i > 0 || filter === null || filter.contains(v2)) {
                                a.push(v2);
                            }
                        });
                    });
                }
                valueType = "item";
            }
            collection = new Exhibit.Expression._Collection(a, valueType);
        } else {
            if (segment.forward) {
                if (i == this._segments.length - 1) {
                    values = database.getSubjectsIntersection(collection.getSet(),
                            segment.property, null, i === 0 ? filter : null);
                } else {
                    values = database.getSubjectsUnion(collection.getSet(),
                            segment.property, null, i === 0 ? filter : null);
                }
                collection = new Exhibit.Expression._Collection(values, "item");
            } else {
                if (i == this._segments.length - 1) {
                    values = database.getObjectsIntersection(collection.getSet(),
                            segment.property, null, i === 0 ? filter : null);
                } else {
                    values = database.getObjectsUnion(collection.getSet(),
                            segment.property, null, i === 0 ? filter : null);
                }
                property = database.getProperty(segment.property);
                valueType = property !== null ? property.getValueType() : "text";
                collection = new Exhibit.Expression._Collection(values, valueType);
            }
        }
    }
    return collection;
};


Exhibit.ListFacet._settingSpecs["combineMode"] = { type:"text", defaultValue: "or" };

// overwrite
Exhibit.ListFacet.prototype.restrict = function(items) {
    if (this._valueSet.size() === 0 && !this._selectMissing) {
        return items;
    }

    var set;
    if (this._settings.combineMode === "and") {
        set = this._cache.getItemsContainingAllValues(this._valueSet, items);
        if (this._selectMissing) {
            set = new Exhibit.Set();
            if (this._valueSet.size() === 0) {
                this._cache.getItemsMissingValue(items, set);
            }
        }
    } else {
        set = this._cache.getItemsFromValues(this._valueSet, items);
        if (this._selectMissing) {
            this._cache.getItemsMissingValue(items, set);
        }
    }

    return set;
};

Exhibit.ListFacet.prototype._computeFacet = function(items) {
    var database = this._uiContext.getDatabase();

    // If we are in intersection-mode, apply our current restrictions to the
    // current item set.
    if (this._settings.combineMode == "and") {
        items = this.restrict(items)
    }

    var r = this._cache.getValueCountsFromItems(items);
    var entries = r.entries;
    var valueType = r.valueType;

    if (entries.length > 0) {
        var selection = this._valueSet;
        var labeler = valueType == "item" ?
            function(v) { var l = database.getObject(v, "label"); return l != null ? l : v; } :
            function(v) { return v; }

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            entry.actionLabel = entry.selectionLabel = labeler(entry.value);
            entry.selected = selection.contains(entry.value);
        }

        entries.sort(this._createSortFunction(valueType));
    }

    if (this._settings.showMissing || this._selectMissing) {
        var count = this._cache.countItemsMissingValue(items);
        if (count > 0 || this._selectMissing) {
            var span = document.createElement("span");
            span.innerHTML = ("missingLabel" in this._settings) ?
                this._settings.missingLabel : Exhibit.FacetUtilities.l10n.missingThisField;
            span.className = "exhibit-facet-value-missingThisField";

            entries.unshift({
                value:          null,
                count:          count,
                selected:       this._selectMissing,
                selectionLabel: span,
                actionLabel:    Exhibit.FacetUtilities.l10n.missingThisField
            });
        }
    }

    return entries;
}
