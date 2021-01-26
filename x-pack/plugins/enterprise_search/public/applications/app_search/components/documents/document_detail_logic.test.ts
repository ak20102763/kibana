/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  LogicMounter,
  mockHttpValues,
  mockKibanaValues,
  mockFlashMessageHelpers,
  expectedAsyncError,
} from '../../../__mocks__';
import { mockEngineValues } from '../../__mocks__';

import { DocumentDetailLogic } from './document_detail_logic';
import { InternalSchemaTypes } from '../../../shared/types';

describe('DocumentDetailLogic', () => {
  const { mount } = new LogicMounter(DocumentDetailLogic);
  const { http } = mockHttpValues;
  const { navigateToUrl } = mockKibanaValues;
  const { setQueuedSuccessMessage, flashAPIErrors } = mockFlashMessageHelpers;

  const DEFAULT_VALUES = {
    dataLoading: true,
    fields: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockEngineValues.engineName = 'engine1';
  });

  describe('actions', () => {
    describe('setFields', () => {
      it('should set fields to the provided value and dataLoading to false', () => {
        const fields = [{ name: 'foo', value: ['foo'], type: 'string' as InternalSchemaTypes }];

        mount({
          dataLoading: true,
          fields: [],
        });

        DocumentDetailLogic.actions.setFields(fields);

        expect(DocumentDetailLogic.values).toEqual({
          ...DEFAULT_VALUES,
          dataLoading: false,
          fields,
        });
      });
    });

    describe('getDocumentDetails', () => {
      it('will call an API endpoint and then store the result', async () => {
        const fields = [{ name: 'name', value: 'python', type: 'string' }];
        jest.spyOn(DocumentDetailLogic.actions, 'setFields');
        const promise = Promise.resolve({ fields });
        http.get.mockReturnValue(promise);

        DocumentDetailLogic.actions.getDocumentDetails('1');

        expect(http.get).toHaveBeenCalledWith(`/api/app_search/engines/engine1/documents/1`);
        await promise;
        expect(DocumentDetailLogic.actions.setFields).toHaveBeenCalledWith(fields);
      });

      it('handles errors', async () => {
        mount();
        const promise = Promise.reject('An error occurred');
        http.get.mockReturnValue(promise);

        DocumentDetailLogic.actions.getDocumentDetails('1');
        await expectedAsyncError(promise);

        expect(flashAPIErrors).toHaveBeenCalledWith('An error occurred', { isQueued: true });
        expect(navigateToUrl).toHaveBeenCalledWith('/engines/engine1/documents');
      });
    });

    describe('deleteDocument', () => {
      let confirmSpy: any;
      let promise: Promise<any>;

      beforeEach(() => {
        confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(jest.fn(() => true));
        promise = Promise.resolve({});
        http.delete.mockReturnValue(promise);
      });

      afterEach(() => {
        confirmSpy.mockRestore();
      });

      it('will call an API endpoint and show a success message on the documents page', async () => {
        mount();
        DocumentDetailLogic.actions.deleteDocument('1');

        expect(http.delete).toHaveBeenCalledWith(`/api/app_search/engines/engine1/documents/1`);
        await promise;
        expect(setQueuedSuccessMessage).toHaveBeenCalledWith(
          'Successfully marked document for deletion. It will be deleted momentarily.'
        );
        expect(navigateToUrl).toHaveBeenCalledWith('/engines/engine1/documents');
      });

      it('will do nothing if not confirmed', async () => {
        mount();
        window.confirm = () => false;

        DocumentDetailLogic.actions.deleteDocument('1');

        expect(http.delete).not.toHaveBeenCalled();
        await promise;
      });

      it('handles errors', async () => {
        mount();
        promise = Promise.reject('An error occured');
        http.delete.mockReturnValue(promise);

        DocumentDetailLogic.actions.deleteDocument('1');
        await expectedAsyncError(promise);

        expect(flashAPIErrors).toHaveBeenCalledWith('An error occured');
      });
    });
  });
});
