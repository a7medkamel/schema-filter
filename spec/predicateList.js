define(['sinon',
  'should',
  'component/test/util/index',
  'component/test/driver/index',
  'lib/underscore',
  'lib/jquery',
  'component/filter/doc/campaignSchema',
  'component/filter/doc/i18nData',
  'component/i18n/index',
  'mockInjector!component/filter/view/predicateList'
], function (sinon, should, util, driver, _, $, campaignSchema, i18nData, I18nModel, predicateListFactory) {
  'use strict';

  describe('predicateList control', function () {

    var PredicateList;

    beforeEach(function () {
      PredicateList = predicateListFactory();
    });

    function instantiateControl(selectedFilter) {
      return util.view(PredicateList, {
        entitySchema: campaignSchema,
        i18n: new I18nModel(i18nData),
        selected: selectedFilter
      });
    }

    describe('initialization', function () {

      it('should create one filter row if no selection provided', function (done) {
        instantiateControl();
        driver.element('li.row', function(error, $el){
          $el.length.should.be.equal(1);
          driver.context($el[0], function(error, firstRow){
            firstRow
              .getValue('.predicate-property', function(err, val){
                val.should.be.equal('NegativeKeywordCount');
              })
              .getValue('.predicate-operator', function(err, val){
                val.should.be.equal('eq');
              })
              .getValue('.predicate-value input:first-child', function(err, val){
                val.should.be.equal('');
                done();
              });
          });
        });
      });

      it('should show the selection if provided', function (done) {
        instantiateControl({
          Name: {
            $startswith: 'test'
          },
          MonthlyBudgetAmount: {
            $gt: 10
          }
        });
        driver.element('li.row', function(error, $el){
          $el.length.should.be.equal(2);
          driver.context($el[0], function(error, firstRow){
            firstRow
              .getValue('.predicate-property', function(err, val){
                val.should.be.equal('Name');
              })
              .getValue('.predicate-operator', function(err, val){
                val.should.be.equal('startswith');
              });
          });

          driver.context($el[1], function(error, secondRow){
            secondRow
              .getValue('.predicate-property', function(err, val){
                val.should.be.equal('MonthlyBudgetAmount');
              })
              .getValue('.predicate-operator', function(err, val){
                val.should.be.equal('gt');
                done();
              });
          });
        });
      });
    });

    describe('actions', function () {

      it('should add a new filter line when "Add" is clicked', function (done) {
        instantiateControl();
        driver.click('a.new')
          .context('li.row:nth-child(2)', function(err, $secRow){
            $secRow.getValue('.predicate-property', function(err, val){
              val.should.be.equal('NegativeKeywordCount');
            })
              .getValue('.predicate-operator', function(err, val){
                val.should.be.equal('eq');
              })
              .getValue('.predicate-value input:first-child', function(err, val){
                val.should.be.equal('');
                done();
              });
          });
      });

      it('should remove a line when "Remove" is clicked', function (done) {
        instantiateControl({
          Name: {
            $startswith: 'test',
            $endswith: 'end'
          },
        });

        driver.click('li.row:eq(0) a.remove', function(){
          driver.element('li.row', function(err, $el){
            $el.length.should.be.equal(1);
          });
          driver.context('li.row:first-child', function(err, $first){
            $first
              .getValue('.predicate-property', function(err, val){
                val.should.be.equal('Name');
              })
              .getValue('.predicate-operator', function(err, val){
                val.should.be.equal('endswith');
                done();
              });
          });
        });
      });
    });

    describe('single predicate editors', function () {

      describe('string value', function () {
        var view,
          $editor,
          $firstRowContext;

        beforeEach(function (done) {
          view = instantiateControl({
            Name: {
              $contains: 'test'
            }
          });
          driver.context('li.row:first-child', function(err, $firstRow){
            $firstRowContext = $firstRow;
            $firstRowContext.element('.predicate-value input[type="text"]', function(err, $ed){
              $editor = $ed;
              done();
            });
          });
        });

        it('should render valid options in operator selector', function (done) {
          $firstRowContext.options('.predicate-operator', function(err, $opts){
            $opts.length.should.be.equal(6);
            var options = _.map($opts, function (optEl) {
              return $(optEl).val();
            });
            options.should.be.deep.equal(['contains', 'doesnotcontain', 'startswith', 'endswith', 'eq', 'neq']);
            done();
          });
        });

        it('should render text editor', function () {
          $editor.length.should.be.equal(1);
        });

        it('should return a predicate if value is not empty', function () {
          $firstRowContext
            .selectByValue('.predicate-operator', 'startswith')
            .setValue($editor, 'test_value');

          view.getPredicates().should.be.deep.equal([{
            Name: {
              $startswith: 'test_value'
            }
          }]);

        });

        it('should return a null predicate if value is empty', function () {
          $firstRowContext.setValue($editor, '   ');
          view.getPredicates().should.be.deep.equal([]);
        });

      });
    });

  });

});
